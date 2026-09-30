import { 
  AttractionRecord, 
  ItineraryRecord, 
  ItineraryItem, 
  PlannerInput, 
  BudgetBreakdown, 
  ReplanningAdjustment,
  TransportPreference 
} from '../types';
import { getAttractions } from './attractionService';
import { CITIES_DATA } from '../data/statesAndCities';

// Haversine distance formula in kilometers
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Transport cost multiplier based on transport type and group size
const getTransportCost = (
  baseCost: number, 
  transportType: TransportPreference, 
  groupSize: number
): number => {
  switch (transportType) {
    case 'Public':
      return Math.round(baseCost * 0.4 * groupSize);
    case 'Metro/Walk':
      return Math.round(baseCost * 0.3 * groupSize);
    case 'Self-Drive':
      return Math.round(baseCost * 0.9 + (groupSize > 3 ? 300 : 0));
    case 'Cab':
    default:
      return Math.round(baseCost * 1.3);
  }
};

export const generateSmartItinerary = async (input: PlannerInput): Promise<ItineraryRecord> => {
  const allAttractions = await getAttractions(input.destinationCityId);
  const city = CITIES_DATA.find((c) => c.id === input.destinationCityId) || {
    name: input.destinationCityId,
  };

  // Score attractions based on matching interests, popularity, and budget affordability
  const scoredAttractions = allAttractions.map((attr) => {
    let score = attr.popularity_score;

    // Boost if matching tags
    const matchedInterests = attr.interest_tags.filter((tag) =>
      input.interests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase()))
    );
    score += matchedInterests.length * 15;

    // Penalty if individual entry fee is more than 30% of total budget
    if (attr.entry_fee * input.groupSize > input.budget * 0.3) {
      score -= 30;
    }

    return { attr, score };
  });

  // Sort descending by score
  scoredAttractions.sort((a, b) => b.score - a.score);

  const selectedAttractions = scoredAttractions.map((s) => s.attr);
  const items: ItineraryItem[] = [];

  // Plan per day (maximum 3-4 attractions per day + meals)
  const daysCount = input.numberOfDays;
  const usedAttractionIds = new Set<string>();

  let currentTimeMinute = 9 * 60; // 09:00 AM start

  const formatTime = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  for (let day = 1; day <= daysCount; day++) {
    currentTimeMinute = 9 * 60; // 09:00 AM each morning
    let orderIndex = 1;

    // Filter available pool
    const availablePool = selectedAttractions.filter((a) => !usedAttractionIds.has(a.id));

    // Choose 3 geographically proximate attractions for this day
    const dayAttractions: AttractionRecord[] = [];

    if (availablePool.length > 0) {
      // Pick highest score as anchor
      const anchor = availablePool[0];
      dayAttractions.push(anchor);
      usedAttractionIds.add(anchor.id);

      // Pick next 2 closest attractions to anchor
      const remainingForDay = availablePool
        .slice(1)
        .map((a) => ({
          attr: a,
          distance: calculateDistanceKm(anchor.latitude, anchor.longitude, a.latitude, a.longitude),
        }))
        .sort((a, b) => a.distance - b.distance);

      for (let i = 0; i < Math.min(2, remainingForDay.length); i++) {
        dayAttractions.push(remainingForDay[i].attr);
        usedAttractionIds.add(remainingForDay[i].attr.id);
      }
    }

    // Now layout Day's schedule:
    // Slot 1: Morning attraction (09:00)
    if (dayAttractions[0]) {
      const first = dayAttractions[0];
      const startMin = currentTimeMinute;
      const endMin = startMin + first.visit_duration;
      items.push({
        id: `item-${day}-1-${first.id}`,
        day_number: day,
        order_index: orderIndex++,
        attraction_id: first.id,
        attraction: first,
        activity_type: 'attraction',
        start_time: formatTime(startMin),
        end_time: formatTime(endMin),
        duration_minutes: first.visit_duration,
        cost: first.entry_fee * input.groupSize,
        transport_type: input.transportPreference,
        travel_time_from_prev: first.travel_time,
        notes: `Morning visit: ${first.description.slice(0, 100)}...`,
      });
      currentTimeMinute = endMin + 20; // 20 min transit
    }

    // Lunch Break (approx 13:00)
    const lunchStart = Math.max(currentTimeMinute, 13 * 60);
    const lunchEnd = lunchStart + 60;
    items.push({
      id: `item-${day}-lunch`,
      day_number: day,
      order_index: orderIndex++,
      custom_title: 'Local Regional Lunch & Rest',
      activity_type: 'meal',
      start_time: formatTime(lunchStart),
      end_time: formatTime(lunchEnd),
      duration_minutes: 60,
      cost: 250 * input.groupSize,
      notes: 'Authentic local cuisine break & hydration stop.',
    });
    currentTimeMinute = lunchEnd + 20;

    // Slot 2: Afternoon attraction (approx 14:30)
    if (dayAttractions[1]) {
      const second = dayAttractions[1];
      const startMin = currentTimeMinute;
      const endMin = startMin + second.visit_duration;
      items.push({
        id: `item-${day}-2-${second.id}`,
        day_number: day,
        order_index: orderIndex++,
        attraction_id: second.id,
        attraction: second,
        activity_type: 'attraction',
        start_time: formatTime(startMin),
        end_time: formatTime(endMin),
        duration_minutes: second.visit_duration,
        cost: second.entry_fee * input.groupSize,
        transport_type: input.transportPreference,
        travel_time_from_prev: second.travel_time,
        notes: `Afternoon exploration: ${second.category} experience.`,
      });
      currentTimeMinute = endMin + 25;
    }

    // Slot 3: Sunset / Evening attraction (approx 17:30)
    if (dayAttractions[2]) {
      const third = dayAttractions[2];
      const startMin = Math.max(currentTimeMinute, 17 * 60);
      const endMin = startMin + third.visit_duration;
      items.push({
        id: `item-${day}-3-${third.id}`,
        day_number: day,
        order_index: orderIndex++,
        attraction_id: third.id,
        attraction: third,
        activity_type: 'attraction',
        start_time: formatTime(startMin),
        end_time: formatTime(endMin),
        duration_minutes: third.visit_duration,
        cost: third.entry_fee * input.groupSize,
        transport_type: input.transportPreference,
        travel_time_from_prev: third.travel_time,
        notes: `Evening / Golden hour highlights.`,
      });
      currentTimeMinute = endMin;
    }
  }

  // Calculate total costs
  const attractionsCost = items
    .filter((i) => i.activity_type === 'attraction')
    .reduce((sum, i) => sum + i.cost, 0);

  const totalTransport = items
    .filter((i) => i.activity_type === 'attraction')
    .reduce((sum, i) => {
      const base = i.attraction?.transport_cost || 100;
      return sum + getTransportCost(base, input.transportPreference, input.groupSize);
    }, 0);

  const totalFood = 500 * input.numberOfDays * input.groupSize;
  const spentBudget = attractionsCost + totalTransport + totalFood;

  return {
    id: `itin-${Date.now()}`,
    destination_city_id: input.destinationCityId,
    destination_city_name: city.name,
    title: `${input.numberOfDays}-Day Smart Journey to ${city.name}`,
    number_of_days: input.numberOfDays,
    total_budget: input.budget,
    spent_budget: spentBudget,
    group_size: input.groupSize,
    transport_preference: input.transportPreference,
    interests: input.interests,
    items,
    status: 'planned',
    created_at: new Date().toISOString(),
  };
};

export const calculateBudgetBreakdown = (
  itinerary: ItineraryRecord
): BudgetBreakdown => {
  const attractionsCost = itinerary.items
    .filter((i) => i.activity_type === 'attraction')
    .reduce((acc, curr) => acc + curr.cost, 0);

  const transportCost = itinerary.items
    .filter((i) => i.activity_type === 'attraction')
    .reduce((acc, curr) => {
      const base = curr.attraction?.transport_cost || 100;
      return acc + getTransportCost(base, itinerary.transport_preference, itinerary.group_size);
    }, 0);

  const foodCost = 600 * itinerary.number_of_days * itinerary.group_size;
  const contingencyCost = Math.round(itinerary.total_budget * 0.08); // 8% emergency buffer
  const totalEstimatedSpend = attractionsCost + transportCost + foodCost + contingencyCost;
  const remainingBudget = Math.max(0, itinerary.total_budget - totalEstimatedSpend);

  // Daily spend calculation
  const dailySpend: { day: number; amount: number }[] = [];
  for (let d = 1; d <= itinerary.number_of_days; d++) {
    const dayAttractionCosts = itinerary.items
      .filter((i) => i.day_number === d && i.activity_type === 'attraction')
      .reduce((acc, curr) => acc + curr.cost, 0);
    const dayTransport = (transportCost / itinerary.number_of_days);
    const dayFood = (foodCost / itinerary.number_of_days);
    dailySpend.push({
      day: d,
      amount: Math.round(dayAttractionCosts + dayTransport + dayFood),
    });
  }

  const percentageUsed = Math.min(
    100,
    Math.round((totalEstimatedSpend / (itinerary.total_budget || 1)) * 100)
  );

  return {
    totalBudget: itinerary.total_budget,
    attractionsCost,
    transportCost,
    foodCost,
    contingencyCost,
    totalEstimatedSpend,
    remainingBudget,
    dailySpend,
    percentageUsed,
  };
};

// Dynamic Replanning: recalculate itinerary on new budget or duration with concrete audit of savings
export const replanItinerary = async (
  currentItinerary: ItineraryRecord,
  newBudget: number,
  newDuration: 1 | 2 | 3,
  newTransport?: TransportPreference
): Promise<{ updatedItinerary: ItineraryRecord; adjustment: ReplanningAdjustment }> => {
  const changes: string[] = [];
  const oldSpent = currentItinerary.spent_budget;
  let transportPref = newTransport || currentItinerary.transport_preference;

  // Rule 1: If budget reduced significantly, switch transport from Cab to Public or Metro
  if (newBudget < currentItinerary.total_budget * 0.75 && transportPref === 'Cab') {
    transportPref = 'Public';
    changes.push('Optimized transport preference: Cab → Public Transit (Saves ~60% transit expenses)');
  }

  // Generate newly calibrated itinerary
  const input: PlannerInput = {
    destinationCityId: currentItinerary.destination_city_id,
    budget: newBudget,
    numberOfDays: newDuration,
    interests: currentItinerary.interests,
    transportPreference: transportPref,
    groupSize: currentItinerary.group_size,
  };

  const updatedItinerary = await generateSmartItinerary(input);

  if (newDuration < currentItinerary.number_of_days) {
    changes.push(`Consolidated schedule from ${currentItinerary.number_of_days} days to ${newDuration} day(s), preserving top priority attractions`);
  } else if (newDuration > currentItinerary.number_of_days) {
    changes.push(`Expanded itinerary to ${newDuration} days to incorporate relaxed exploration windows`);
  }

  const savedAmount = Math.max(0, oldSpent - updatedItinerary.spent_budget);
  if (savedAmount > 0) {
    changes.push(`Total estimated expenditure reduced by ₹${savedAmount.toLocaleString('en-IN')}`);
  }

  return {
    updatedItinerary,
    adjustment: {
      timestamp: new Date().toLocaleTimeString(),
      summary: `Adapted to ₹${newBudget.toLocaleString('en-IN')} budget across ${newDuration} day(s)`,
      savedAmount,
      changes,
    },
  };
};
