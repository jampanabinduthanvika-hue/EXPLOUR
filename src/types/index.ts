export type AttractionCategory = 
  | 'Beach' 
  | 'Heritage' 
  | 'Nature' 
  | 'Adventure' 
  | 'Religious' 
  | 'Shopping' 
  | 'Culture' 
  | 'Food';

export type TransportPreference = 'Public' | 'Cab' | 'Metro/Walk' | 'Self-Drive';

export interface StateRecord {
  id: string;
  name: string;
  code: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East';
  description: string;
  banner_image: string;
  created_at?: string;
}

export interface CityRecord {
  id: string;
  state_id: string;
  name: string;
  tagline: string;
  latitude: number;
  longitude: number;
  ideal_days: number;
  avg_daily_budget: number;
  best_season: string;
  image_url: string;
  created_at?: string;
}

export interface AttractionRecord {
  id: string;
  city_id: string;
  state_id: string;
  name: string;
  category: AttractionCategory;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  entry_fee: number; // in INR ₹
  opening_time: string; // e.g. "09:00"
  closing_time: string; // e.g. "18:00"
  visit_duration: number; // in minutes
  popularity_score: number; // 1 - 100
  interest_tags: string[];
  transport_cost: number; // approximate INR cost
  travel_time: number; // minutes from city center
  created_at?: string;
}

export interface WeatherAlertRecord {
  id: string;
  city_id: string;
  city_name: string;
  alert_type: 'Rain' | 'Thunderstorm' | 'Heat' | 'UV Alert' | 'Fog' | 'Clear';
  severity: 'low' | 'moderate' | 'high' | 'severe';
  title: string;
  description: string;
  advisory: string[];
  indoor_alternatives?: string[];
  valid_until: string;
  created_at?: string;
}

export interface TravelAlertRecord {
  id: string;
  city_id: string;
  city_name: string;
  alert_type: 'Traffic' | 'Crowd' | 'Festival' | 'AQI' | 'Closure' | 'Safety';
  severity: 'low' | 'moderate' | 'high';
  message: string;
  impact_areas: string;
  created_at?: string;
}

export interface TravelUpdateRecord {
  id: string;
  author_name: string;
  author_handle: string;
  author_role: 'Verified Local' | 'Tourism Dept' | 'Traffic Police' | 'Traveler' | 'Explour AI';
  author_avatar?: string;
  city: string;
  category: 'Tourism' | 'Weather' | 'Traffic' | 'Festival' | 'User Tip' | 'Safety';
  content: string;
  likes_count: number;
  is_verified: boolean;
  timestamp: string;
  created_at?: string;
}

export interface ItineraryItem {
  id: string;
  itinerary_id?: string;
  day_number: number;
  order_index: number;
  attraction_id?: string;
  attraction?: AttractionRecord;
  custom_title?: string;
  activity_type: 'attraction' | 'meal' | 'transport' | 'rest';
  start_time: string;
  end_time: string;
  duration_minutes: number;
  cost: number; // INR
  transport_type?: TransportPreference;
  travel_time_from_prev?: number; // minutes
  notes?: string;
}

export interface ItineraryRecord {
  id: string;
  user_id?: string;
  destination_city_id: string;
  destination_city_name: string;
  title: string;
  number_of_days: number;
  total_budget: number;
  spent_budget: number;
  group_size: number;
  transport_preference: TransportPreference;
  interests: string[];
  items: ItineraryItem[];
  created_at?: string;
  status: 'planned' | 'active' | 'completed';
}

export interface BudgetBreakdown {
  totalBudget: number;
  attractionsCost: number;
  transportCost: number;
  foodCost: number;
  contingencyCost: number;
  totalEstimatedSpend: number;
  remainingBudget: number;
  dailySpend: { day: number; amount: number }[];
  percentageUsed: number;
}

export interface PlannerInput {
  destinationCityId: string;
  budget: number;
  numberOfDays: 1 | 2 | 3;
  interests: string[];
  transportPreference: TransportPreference;
  groupSize: number;
}

export interface ReplanningAdjustment {
  timestamp: string;
  summary: string;
  savedAmount: number;
  changes: string[];
}
