-- =========================================================================
-- EXPLOUR — PRODUCTION SEED DATA (INDIA EDITION)
-- =========================================================================

-- INSERT STATES
INSERT INTO public.states (id, name, code, region, description, banner_image) VALUES
('andhra-pradesh', 'Andhra Pradesh', 'AP', 'South', 'Home to sacred hill shrines, pristine Bay of Bengal coastlines, and verdant Eastern Ghats valleys.', 'https://images.unsplash.com/photo-1600100397608-f010f443b782?auto=format&fit=crop&w=1200&q=80'),
('telangana', 'Telangana', 'TG', 'South', 'Where centuries-old Nizami heritage blends seamlessly with cutting-edge tech and architectural wonders.', 'https://images.unsplash.com/photo-1605335198038-f1f4ba3e4760?auto=format&fit=crop&w=1200&q=80'),
('goa', 'Goa', 'GA', 'West', 'Golden sand shores, Portuguese colonial cathedrals, spice plantations, and vibrant coastal culture.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'),
('kerala', 'Kerala', 'KL', 'South', 'God’s Own Country: tranquil emerald backwaters, rolling tea gardens, and lush Ayurvedic sanctuaries.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'),
('rajasthan', 'Rajasthan', 'RJ', 'North', 'The royal desert land of grand hill forts, lake palaces, vibrant textiles, and Rajput valor.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'),
('delhi', 'Delhi', 'DL', 'North', 'The monumental heart of India, spanning Mughal domes, colonial boulevards, and street food corridors.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80'),
('maharashtra', 'Maharashtra', 'MH', 'West', 'Dynamic cosmopolitan shores, Sahyadri mountain retreats, and UNESCO rock-cut cave art.', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80'),
('karnataka', 'Karnataka', 'KA', 'South', 'From majestic Hoysala temples and boulder-strewn Hampi ruins to the opulent Mysore Palace.', 'https://images.unsplash.com/photo-1600100397608-f010f443b782?auto=format&fit=crop&w=1200&q=80'),
('tamil-nadu', 'Tamil Nadu', 'TN', 'South', 'Dravidian gopurams reaching the sky, mist-covered Nilgiri tea hills, and rich Carnatic traditions.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'),
('jammu-kashmir', 'Jammu and Kashmir', 'JK', 'North', 'Paradise on Earth: mirror-like Dal Lake shikaras, snow-blanketed ski peaks, and pine-clad valleys.', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'),
('ladakh', 'Ladakh', 'LA', 'North', 'The high-altitude cold desert of turquoise lakes, wind-whipped mountain passes, and ancient monasteries.', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- INSERT CITIES
INSERT INTO public.cities (id, state_id, name, tagline, latitude, longitude, ideal_days, avg_daily_budget, best_season, image_url) VALUES
('visakhapatnam', 'andhra-pradesh', 'Visakhapatnam', 'The Jewel of the East Coast', 17.6868, 83.2185, 2, 2500, 'October to March', 'https://images.unsplash.com/photo-1600100397608-f010f443b782?auto=format&fit=crop&w=800&q=80'),
('araku-valley', 'andhra-pradesh', 'Araku Valley', 'Coffee Plantations & Mist in Eastern Ghats', 18.3273, 82.8775, 2, 2200, 'September to March', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'),
('tirupati', 'andhra-pradesh', 'Tirupati', 'Sacred Seven Hills of Lord Venkateswara', 13.6288, 79.4192, 2, 2000, 'Year-round', 'https://images.unsplash.com/photo-1608408891486-f5ddb97b09c2?auto=format&fit=crop&w=800&q=80'),
('hyderabad', 'telangana', 'Hyderabad', 'City of Pearls, Biryani & Nizami Forts', 17.3850, 78.4867, 3, 3200, 'October to February', 'https://images.unsplash.com/photo-1605335198038-f1f4ba3e4760?auto=format&fit=crop&w=800&q=80'),
('warangal', 'telangana', 'Warangal', 'Glorious Kakatiya Dynasty Heritage', 17.9689, 79.5941, 1, 1800, 'October to March', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80'),
('north-goa', 'goa', 'North Goa', 'Sun-drenched beaches, forts, and nightlife', 15.5494, 73.7535, 3, 3800, 'November to March', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'),
('south-goa', 'goa', 'South Goa', 'Quiet white sands & Portuguese heritage', 15.2832, 73.9862, 2, 3600, 'November to March', 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80'),
('kochi', 'kerala', 'Kochi', 'Queen of the Arabian Sea & colonial spice ports', 9.9312, 76.2673, 2, 2800, 'September to March', 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'),
('munnar', 'kerala', 'Munnar', 'Emerald tea terraces, waterfalls & misty peaks', 10.0889, 77.0595, 2, 3000, 'September to May', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'),
('alleppey', 'kerala', 'Alleppey', 'Venice of the East & classic houseboats', 9.4981, 76.3388, 2, 3500, 'October to March', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'),
('jaipur', 'rajasthan', 'Jaipur', 'The Pink City of Maharajas and grand palaces', 26.9124, 75.7873, 3, 3400, 'October to March', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'),
('udaipur', 'rajasthan', 'Udaipur', 'City of Lakes, royal romance and marble courtyards', 24.5854, 73.7125, 2, 3800, 'September to March', 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'),
('jodhpur', 'rajasthan', 'Jodhpur', 'The Blue City overlooked by mighty Mehrangarh', 26.2389, 73.0243, 2, 2800, 'October to March', 'https://images.unsplash.com/photo-1568283661168-5226ecba28b2?auto=format&fit=crop&w=800&q=80'),
('new-delhi', 'delhi', 'New Delhi', 'Sultanates, Mughal grandeur & India Gate', 28.6139, 77.2090, 3, 3200, 'October to March', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'),
('mumbai', 'maharashtra', 'Mumbai', 'Maximum City: Marine Drive, Gateway & Street Food', 18.9220, 72.8347, 3, 4500, 'November to February', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'),
('mysore', 'karnataka', 'Mysore', 'City of Palaces, silk sarees & fragrant sandalwood', 12.2958, 76.6394, 2, 2600, 'September to March', 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80'),
('hampi', 'karnataka', 'Hampi', 'UNESCO boulder kingdom of the Vijayanagara Empire', 15.3350, 76.4600, 2, 2200, 'October to February', 'https://images.unsplash.com/photo-1600100397608-f010f443b782?auto=format&fit=crop&w=800&q=80'),
('chennai', 'tamil-nadu', 'Chennai', 'Marina Beach, temples & classical arts', 13.0827, 80.2707, 2, 2800, 'November to February', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'),
('ooty', 'tamil-nadu', 'Ooty', 'Queen of Hill Stations & Nilgiri Toy Train', 11.4102, 76.6950, 2, 3100, 'October to June', 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'),
('srinagar', 'jammu-kashmir', 'Srinagar', 'Floating shikaras, Mughal gardens & snowy ridges', 34.0837, 74.7973, 3, 4200, 'April to October', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'),
('gulmarg', 'jammu-kashmir', 'Gulmarg', 'Meadow of Flowers & Asia’s highest cable car', 34.0484, 74.3805, 2, 4600, 'December to March', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'),
('leh', 'ladakh', 'Leh', 'Ancient Tibetan monasteries & high Himalayan passes', 34.1526, 77.5771, 3, 4500, 'May to September', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'),
('nubra-valley', 'ladakh', 'Nubra Valley', 'Diskit Buddha & double-humped camel dunes', 34.6863, 77.5673, 2, 4000, 'June to September', 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- INSERT WEATHER ALERTS
INSERT INTO public.weather_alerts (id, city_id, city_name, alert_type, severity, title, description, advisory, indoor_alternatives, valid_until) VALUES
('w-alert-munnar-rain', 'munnar', 'Munnar', 'Rain', 'moderate', 'Intermittent Western Ghats Showers', 'Passing monsoon mists and light rain showers expected in high-altitude tea plantations during late afternoon.', ARRAY['Carry a sturdy umbrella or rain poncho', 'Wear shoes with good grip on wet granite steps', 'Keep camera gear in waterproof covers'], ARRAY['KDHP Tea Museum', 'Punnamada Spice Garden Tour', 'Ayurvedic Massage Centre'], 'Today, 20:00 IST'),
('w-alert-jaipur-heat', 'jaipur', 'Jaipur', 'Heat', 'moderate', 'High Afternoon Solar Index (36°C)', 'Dry heat peak between 12:00 PM and 3:30 PM across open fort ramparts of Amber and Nahargarh.', ARRAY['Schedule hill fort climbs before 11:00 AM or after 4:00 PM', 'Drink 2.5L water with electrolytes', 'Wear sunglasses and wide-brim headwear'], ARRAY['City Palace Chandra Mahal Galleries', 'Albert Hall Museum', 'Anokhi Hand Printing Museum'], 'Today, 17:00 IST'),
('w-alert-gulmarg-snow', 'gulmarg', 'Gulmarg', 'Thunderstorm', 'high', 'Fresh Snowfall & High-Altitude Wind Gusts', 'Phase 2 Gondola to Apharwat peak may face temporary holds if wind speeds exceed 40 km/h.', ARRAY['Check gondola board status at base station before queueing', 'Ensure multi-layer thermal clothing and waterproof snow boots', 'Keep mobile devices in inner pockets to prevent battery drain'], ARRAY['Highland Park Vintage Lounge', 'Gulmarg Golf Club House', 'Kashmiri Craft Weaving Center'], 'Tomorrow, 12:00 IST'),
('w-alert-leh-uv', 'leh', 'Leh', 'UV Alert', 'high', 'Extreme High-Altitude UV Index (Rating 11)', 'Leh is situated at 11,500 feet elevation; solar radiation is 40% more intense than sea level.', ARRAY['Apply SPF 50+ broad-spectrum sunscreen every 2 hours', 'Wear UV400 rated sunglasses with lateral eye shields', 'Hydrate constantly to counteract dry Himalayan wind'], ARRAY['Hall of Fame Museum', 'Central Asian Museum Leh', 'Leh Palace Inner Monastic Chambers'], 'Today, 18:30 IST')
ON CONFLICT (id) DO NOTHING;

-- INSERT TRAVEL ALERTS
INSERT INTO public.travel_alerts (id, city_id, city_name, alert_type, severity, message, impact_areas) VALUES
('t-alert-hyd-traffic', 'hyderabad', 'Hyderabad', 'Traffic', 'moderate', 'Heavy vehicular movement near Charminar & Nayapul bridge due to ongoing weekend evening bazaar. Metro transit to MGBS recommended.', 'Old City, Charminar precinct, Madina Building'),
('t-alert-tirupati-crowd', 'tirupati', 'Tirupati', 'Crowd', 'high', 'Special weekend darshan token queues currently averaging 3-4 hours wait. Book special entry ₹300 tickets online in advance.', 'Tirumala Vaikuntam Queue Complex'),
('t-alert-delhi-aqi', 'new-delhi', 'New Delhi', 'AQI', 'moderate', 'Moderate morning haze recorded in Central Ridge. N95 masks recommended for outdoor jogs before 8:00 AM.', 'India Gate, Connaught Place, Red Fort gardens')
ON CONFLICT (id) DO NOTHING;

-- INSERT TRAVEL UPDATES
INSERT INTO public.travel_updates (id, author_name, author_handle, author_role, city, category, content, likes_count, is_verified, timestamp) VALUES
('update-1', 'Goa Tourism Official', '@GoaTourismGov', 'Tourism Dept', 'North Goa', 'Tourism', 'Blue Flag certification inspection completed successfully at Miramar & Rushikonda corridors. Clean beach initiative in full swing! Remember to avoid single-use plastics on the shore. 🏖️🌊', 342, true, '25m ago'),
('update-2', 'Kashmir Route Watch', '@KashmirRoads', 'Traffic Police', 'Gulmarg', 'Traffic', 'Tangmarg to Gulmarg road is open for vehicles with snow chains installed. Clear sunny morning with 4 inches fresh powder at Phase 1. Drive safely below 30 km/h! ❄️🚗', 519, true, '1h ago'),
('update-3', 'Priya Sharma', '@priyatravels_in', 'Verified Local', 'Jaipur', 'User Tip', 'Pro tip for Amber Fort visitors: Take the tunnel walk from Amer Fort to Jaigarh Fort! It’s cool, avoids the hot hill path, and the cannon view at the top is completely unmatched.', 284, true, '3h ago'),
('update-4', 'Explour Realtime Bot', '@ExplourIntelligence', 'Explour AI', 'Hyderabad', 'Safety', 'Automated advisory: Charminar night illumination extended until 11:30 PM this weekend. Best street food spots along Ghansi Bazaar are best accessed by foot or auto rickshaw from MGBS.', 167, true, '4h ago'),
('update-5', 'Kerala Backwater Watch', '@KeralaWaterways', 'Tourism Dept', 'Alleppey', 'Festival', 'Snake boat regatta practice sessions underway near Punnamada Finishing Point every afternoon between 3 PM and 5 PM. Spectacular sights for tourists on public ferries!', 420, true, '6h ago')
ON CONFLICT (id) DO NOTHING;
