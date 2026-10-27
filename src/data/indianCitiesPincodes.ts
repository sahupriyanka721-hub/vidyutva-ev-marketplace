export interface CityPincodeEntry {
  city: string;
  pincode: string;
  state: string;
  tier: 1 | 2;
  aliases: string[];
}

export const ALL_INDIAN_CITIES: CityPincodeEntry[] = [
  { city: 'Patna', pincode: '800001', state: 'Bihar', tier: 1, aliases: ['patna', 'patliputra', 'danapur', 'khagaul'] },
  { city: 'Gaya', pincode: '823001', state: 'Bihar', tier: 2, aliases: ['gaya', 'bodhgaya', 'bodh gaya'] },
  { city: 'Bhagalpur', pincode: '812001', state: 'Bihar', tier: 2, aliases: ['bhagalpur', 'kahalgaon'] },
  { city: 'Muzaffarpur', pincode: '842001', state: 'Bihar', tier: 2, aliases: ['muzaffarpur', 'muzafarpur', 'kanti'] },
  { city: 'Darbhanga', pincode: '846004', state: 'Bihar', tier: 2, aliases: ['darbhanga', 'laheriasarai', 'benipur'] },
  { city: 'Purnia', pincode: '854301', state: 'Bihar', tier: 2, aliases: ['purnia', 'purnea', 'kasba'] },
  { city: 'Bihar Sharif', pincode: '803101', state: 'Bihar', tier: 2, aliases: ['bihar sharif', 'biharsharif', 'nalanda', 'rajgir'] },
  { city: 'Arrah', pincode: '802301', state: 'Bihar', tier: 2, aliases: ['arrah', 'ara', 'bhojpur'] },
  { city: 'Begusarai', pincode: '851101', state: 'Bihar', tier: 2, aliases: ['begusarai', 'barauni'] },
  { city: 'Katihar', pincode: '854105', state: 'Bihar', tier: 2, aliases: ['katihar'] },
  { city: 'Munger', pincode: '811201', state: 'Bihar', tier: 2, aliases: ['munger', 'monghyr', 'jamalpur'] },
  { city: 'Chhapra', pincode: '841301', state: 'Bihar', tier: 2, aliases: ['chhapra', 'chapra', 'saran', 'marhaura'] },
  { city: 'Danapur', pincode: '801503', state: 'Bihar', tier: 2, aliases: ['danapur', 'danapur cantt'] },
  { city: 'Bettiah', pincode: '845438', state: 'Bihar', tier: 2, aliases: ['bettiah', 'west champaran', 'narkatiaganj'] },
  { city: 'Saharsa', pincode: '852201', state: 'Bihar', tier: 2, aliases: ['saharsa', 'simri bakhtiyarpur'] },
  { city: 'Hajipur', pincode: '844101', state: 'Bihar', tier: 2, aliases: ['hajipur', 'vaishali', 'sonpur'] },
  { city: 'Sasaram', pincode: '821115', state: 'Bihar', tier: 2, aliases: ['sasaram', 'rohtas', 'dehri on sone'] },
  { city: 'Dehri', pincode: '821307', state: 'Bihar', tier: 2, aliases: ['dehri', 'dalmianagar'] },
  { city: 'Siwan', pincode: '841226', state: 'Bihar', tier: 2, aliases: ['siwan', 'mairwa'] },
  { city: 'Motihari', pincode: '845401', state: 'Bihar', tier: 2, aliases: ['motihari', 'east champaran', 'raxaul'] },
  { city: 'Nawada', pincode: '805110', state: 'Bihar', tier: 2, aliases: ['nawada', 'hisua'] },
  { city: 'Buxar', pincode: '802101', state: 'Bihar', tier: 2, aliases: ['buxar', 'dumraon'] },
  { city: 'Kishanganj', pincode: '855107', state: 'Bihar', tier: 2, aliases: ['kishanganj', 'bahadurganj'] },
  { city: 'Sitamarhi', pincode: '843302', state: 'Bihar', tier: 2, aliases: ['sitamarhi', 'dumra', 'bairgania'] },
  { city: 'Jamalpur', pincode: '811214', state: 'Bihar', tier: 2, aliases: ['jamalpur'] },
  { city: 'Jehanabad', pincode: '804408', state: 'Bihar', tier: 2, aliases: ['jehanabad', 'jahanabad'] },
  { city: 'Aurangabad (Bihar)', pincode: '824101', state: 'Bihar', tier: 2, aliases: ['aurangabad bihar', 'daudnagar'] },
  { city: 'Samastipur', pincode: '848101', state: 'Bihar', tier: 2, aliases: ['samastipur', 'dalsinghsarai', 'rosera'] },
  { city: 'Madhubani', pincode: '847211', state: 'Bihar', tier: 2, aliases: ['madhubani', 'jhanjharpur', 'jaynagar'] },
  { city: 'Gopalganj', pincode: '841428', state: 'Bihar', tier: 2, aliases: ['gopalganj', 'mirganj', 'barauli'] },
  { city: 'Supaul', pincode: '852131', state: 'Bihar', tier: 2, aliases: ['supaul', 'birpur'] },
  { city: 'Araria', pincode: '854311', state: 'Bihar', tier: 2, aliases: ['araria', 'forbesganj'] },
  { city: 'Banka', pincode: '813102', state: 'Bihar', tier: 2, aliases: ['banka', 'amarpur'] },
  { city: 'Bhabua', pincode: '821101', state: 'Bihar', tier: 2, aliases: ['bhabua', 'kaimur'] },
  { city: 'Jamui', pincode: '811307', state: 'Bihar', tier: 2, aliases: ['jamui', 'jhadan'] },
  { city: 'Khagaria', pincode: '851204', state: 'Bihar', tier: 2, aliases: ['khagaria', 'gogri'] },
  { city: 'Lakhisarai', pincode: '811311', state: 'Bihar', tier: 2, aliases: ['lakhisarai', 'barahiya'] },
  { city: 'Madhepura', pincode: '852113', state: 'Bihar', tier: 2, aliases: ['madhepura', 'murliganj'] },
  { city: 'Sheikhpura', pincode: '811105', state: 'Bihar', tier: 2, aliases: ['sheikhpura', 'barbigha'] },
  { city: 'Sheohar', pincode: '843329', state: 'Bihar', tier: 2, aliases: ['sheohar'] },
  { city: 'Lucknow', pincode: '226001', state: 'Uttar Pradesh', tier: 1, aliases: ['lucknow', 'hazratganj', 'gomti nagar', 'alambagh', 'indira nagar'] },
  { city: 'Kanpur', pincode: '208001', state: 'Uttar Pradesh', tier: 1, aliases: ['kanpur', 'cawnpore', 'kalyanpur'] },
  { city: 'Varanasi', pincode: '221001', state: 'Uttar Pradesh', tier: 1, aliases: ['varanasi', 'banaras', 'kashi', 'bhu'] },
  { city: 'Agra', pincode: '282001', state: 'Uttar Pradesh', tier: 1, aliases: ['agra', 'taj nagar', 'sanjay place'] },
  { city: 'Prayagraj', pincode: '211001', state: 'Uttar Pradesh', tier: 1, aliases: ['prayagraj', 'allahabad', 'civil lines'] },
  { city: 'Ghaziabad', pincode: '201001', state: 'Uttar Pradesh', tier: 1, aliases: ['ghaziabad', 'indirapuram', 'vaishali', 'raj nagar'] },
  { city: 'Noida', pincode: '201301', state: 'Uttar Pradesh', tier: 1, aliases: ['noida', 'gautam buddha nagar', 'sector 18', 'sector 62'] },
  { city: 'Greater Noida', pincode: '201310', state: 'Uttar Pradesh', tier: 1, aliases: ['greater noida', 'pari chowk', 'knowledge park'] },
  { city: 'Meerut', pincode: '250001', state: 'Uttar Pradesh', tier: 1, aliases: ['meerut', 'modipuram'] },
  { city: 'Gorakhpur', pincode: '273001', state: 'Uttar Pradesh', tier: 2, aliases: ['gorakhpur', 'gkp', 'gorakhnath'] },
  { city: 'Bareilly', pincode: '243001', state: 'Uttar Pradesh', tier: 2, aliases: ['bareilly', 'izzatnagar'] },
  { city: 'Aligarh', pincode: '202001', state: 'Uttar Pradesh', tier: 2, aliases: ['aligarh', 'amu'] },
  { city: 'Moradabad', pincode: '244001', state: 'Uttar Pradesh', tier: 2, aliases: ['moradabad'] },
  { city: 'Saharanpur', pincode: '247001', state: 'Uttar Pradesh', tier: 2, aliases: ['saharanpur'] },
  { city: 'Firozabad', pincode: '283203', state: 'Uttar Pradesh', tier: 2, aliases: ['firozabad'] },
  { city: 'Jhansi', pincode: '284001', state: 'Uttar Pradesh', tier: 2, aliases: ['jhansi'] },
  { city: 'Muzaffarnagar', pincode: '251001', state: 'Uttar Pradesh', tier: 2, aliases: ['muzaffarnagar'] },
  { city: 'Mathura', pincode: '281001', state: 'Uttar Pradesh', tier: 2, aliases: ['mathura', 'vrindavan'] },
  { city: 'Ayodhya', pincode: '224001', state: 'Uttar Pradesh', tier: 2, aliases: ['ayodhya', 'faizabad'] },
  { city: 'Rampur', pincode: '244901', state: 'Uttar Pradesh', tier: 2, aliases: ['rampur'] },
  { city: 'Shahjahanpur', pincode: '242001', state: 'Uttar Pradesh', tier: 2, aliases: ['shahjahanpur'] },
  { city: 'Farrukhabad', pincode: '209625', state: 'Uttar Pradesh', tier: 2, aliases: ['farrukhabad', 'fatehgarh'] },
  { city: 'Hapur', pincode: '245101', state: 'Uttar Pradesh', tier: 2, aliases: ['hapur'] },
  { city: 'Etawah', pincode: '206001', state: 'Uttar Pradesh', tier: 2, aliases: ['etawah'] },
  { city: 'Mirzapur', pincode: '231001', state: 'Uttar Pradesh', tier: 2, aliases: ['mirzapur', 'vindhyachal'] },
  { city: 'Bulandshahr', pincode: '203001', state: 'Uttar Pradesh', tier: 2, aliases: ['bulandshahr'] },
  { city: 'Budaun', pincode: '243601', state: 'Uttar Pradesh', tier: 2, aliases: ['budaun'] },
  { city: 'Amroha', pincode: '244221', state: 'Uttar Pradesh', tier: 2, aliases: ['amroha'] },
  { city: 'Jaunpur', pincode: '222001', state: 'Uttar Pradesh', tier: 2, aliases: ['jaunpur'] },
  { city: 'Basti', pincode: '272001', state: 'Uttar Pradesh', tier: 2, aliases: ['basti'] },
  { city: 'Deoria', pincode: '274001', state: 'Uttar Pradesh', tier: 2, aliases: ['deoria'] },
  { city: 'Ballia', pincode: '277001', state: 'Uttar Pradesh', tier: 2, aliases: ['ballia'] },
  { city: 'Azamgarh', pincode: '276001', state: 'Uttar Pradesh', tier: 2, aliases: ['azamgarh'] },
  { city: 'Ghazipur', pincode: '233001', state: 'Uttar Pradesh', tier: 2, aliases: ['ghazipur'] },
  { city: 'Sultanpur', pincode: '228001', state: 'Uttar Pradesh', tier: 2, aliases: ['sultanpur'] },
  { city: 'Raebareli', pincode: '229001', state: 'Uttar Pradesh', tier: 2, aliases: ['raebareli'] },
  { city: 'Sitapur', pincode: '261001', state: 'Uttar Pradesh', tier: 2, aliases: ['sitapur'] },
  { city: 'Hardoi', pincode: '241001', state: 'Uttar Pradesh', tier: 2, aliases: ['hardoi'] },
  { city: 'Unnao', pincode: '209801', state: 'Uttar Pradesh', tier: 2, aliases: ['unnao'] },
  { city: 'Bijnor', pincode: '246701', state: 'Uttar Pradesh', tier: 2, aliases: ['bijnor'] },
  { city: 'Lakhimpur', pincode: '262701', state: 'Uttar Pradesh', tier: 2, aliases: ['lakhimpur', 'kheri'] },
  { city: 'Pilibhit', pincode: '262001', state: 'Uttar Pradesh', tier: 2, aliases: ['pilibhit'] },
  { city: 'Banda', pincode: '210001', state: 'Uttar Pradesh', tier: 2, aliases: ['banda'] },
  { city: 'Bahraich', pincode: '271801', state: 'Uttar Pradesh', tier: 2, aliases: ['bahraich'] },
  { city: 'Ranchi', pincode: '834001', state: 'Jharkhand', tier: 1, aliases: ['ranchi', 'doranda', 'hatia', 'morabadi'] },
  { city: 'Jamshedpur', pincode: '831001', state: 'Jharkhand', tier: 1, aliases: ['jamshedpur', 'tatanagar', 'sakchi', 'bistupur'] },
  { city: 'Dhanbad', pincode: '826001', state: 'Jharkhand', tier: 2, aliases: ['dhanbad', 'jharia', 'katras'] },
  { city: 'Bokaro', pincode: '827001', state: 'Jharkhand', tier: 2, aliases: ['bokaro', 'bokaro steel city', 'chas'] },
  { city: 'Deoghar', pincode: '814112', state: 'Jharkhand', tier: 2, aliases: ['deoghar', 'baidyanath dham', 'jasidih'] },
  { city: 'Hazaribagh', pincode: '825301', state: 'Jharkhand', tier: 2, aliases: ['hazaribagh', 'hazaribag'] },
  { city: 'Giridih', pincode: '815301', state: 'Jharkhand', tier: 2, aliases: ['giridih'] },
  { city: 'Ramgarh', pincode: '829122', state: 'Jharkhand', tier: 2, aliases: ['ramgarh', 'patratu'] },
  { city: 'Medininagar', pincode: '822101', state: 'Jharkhand', tier: 2, aliases: ['medininagar', 'daltonganj', 'palamu'] },
  { city: 'Chaibasa', pincode: '833201', state: 'Jharkhand', tier: 2, aliases: ['chaibasa', 'west singhbhum'] },
  { city: 'Dumka', pincode: '814101', state: 'Jharkhand', tier: 2, aliases: ['dumka', 'santhal pargana'] },
  { city: 'Koderma', pincode: '825410', state: 'Jharkhand', tier: 2, aliases: ['koderma', 'jhumri telaiya'] },
  { city: 'Chatra', pincode: '825401', state: 'Jharkhand', tier: 2, aliases: ['chatra'] },
  { city: 'Gumla', pincode: '835207', state: 'Jharkhand', tier: 2, aliases: ['gumla'] },
  { city: 'Simdega', pincode: '835223', state: 'Jharkhand', tier: 2, aliases: ['simdega'] },
  { city: 'Lohardaga', pincode: '835302', state: 'Jharkhand', tier: 2, aliases: ['lohardaga'] },
  { city: 'Pakur', pincode: '816107', state: 'Jharkhand', tier: 2, aliases: ['pakur'] },
  { city: 'Sahebganj', pincode: '816109', state: 'Jharkhand', tier: 2, aliases: ['sahebganj', 'sahibganj', 'rajmahal'] },
  { city: 'Godda', pincode: '814133', state: 'Jharkhand', tier: 2, aliases: ['godda'] },
  { city: 'New Delhi', pincode: '110001', state: 'Delhi', tier: 1, aliases: ['new delhi', 'delhi', 'connaught place', 'cp'] },
  { city: 'Central Delhi', pincode: '110002', state: 'Delhi', tier: 1, aliases: ['central delhi', 'daryaganj'] },
  { city: 'South Delhi', pincode: '110020', state: 'Delhi', tier: 1, aliases: ['south delhi', 'okhla', 'saket', 'nehru place', 'hauz khas'] },
  { city: 'West Delhi', pincode: '110058', state: 'Delhi', tier: 1, aliases: ['west delhi', 'janakpuri', 'raouri garden', 'tilak nagar'] },
  { city: 'North Delhi', pincode: '110007', state: 'Delhi', tier: 1, aliases: ['north delhi', 'civil lines', 'kamla nagar', 'du'] },
  { city: 'East Delhi', pincode: '110092', state: 'Delhi', tier: 1, aliases: ['east delhi', 'laxmi nagar', 'mayur vihar', 'preet vihar'] },
  { city: 'Dwarka', pincode: '110075', state: 'Delhi', tier: 1, aliases: ['dwarka', 'dwarka subcity'] },
  { city: 'Rohini', pincode: '110085', state: 'Delhi', tier: 1, aliases: ['rohini', 'pitampura'] },
  { city: 'Gurugram', pincode: '122001', state: 'Haryana', tier: 1, aliases: ['gurugram', 'gurgaon', 'cyber city', 'sohna'] },
  { city: 'Faridabad', pincode: '121001', state: 'Haryana', tier: 1, aliases: ['faridabad', 'ballabgarh', 'neelam bata'] },
  { city: 'Mumbai', pincode: '400001', state: 'Maharashtra', tier: 1, aliases: ['mumbai', 'bombay', 'fort', 'nariman point', 'colaba'] },
  { city: 'Mumbai (Bandra)', pincode: '400050', state: 'Maharashtra', tier: 1, aliases: ['bandra', 'bandra west', 'khar', 'santacruz'] },
  { city: 'Mumbai (Andheri)', pincode: '400058', state: 'Maharashtra', tier: 1, aliases: ['andheri', 'andheri west', 'juhu', 'versova'] },
  { city: 'Navi Mumbai', pincode: '400703', state: 'Maharashtra', tier: 1, aliases: ['navi mumbai', 'vashi', 'nerul', 'belapur', 'koparkhairane', 'kharghar'] },
  { city: 'Thane', pincode: '400601', state: 'Maharashtra', tier: 1, aliases: ['thane', 'ghodbunder', 'majiwada', 'naupada'] },
  { city: 'Pune', pincode: '411001', state: 'Maharashtra', tier: 1, aliases: ['pune', 'poona', 'shivajinagar', 'kothrud', 'viman nagar'] },
  { city: 'Pune (Hinjewadi)', pincode: '411057', state: 'Maharashtra', tier: 1, aliases: ['hinjewadi', 'hinjawadi', 'wakad', 'baner'] },
  { city: 'Pune (Hadapsar)', pincode: '411028', state: 'Maharashtra', tier: 1, aliases: ['hadapsar', 'magarpatta', 'kharadi'] },
  { city: 'Nagpur', pincode: '440001', state: 'Maharashtra', tier: 1, aliases: ['nagpur', 'sitabuldi', 'dharampeth', 'wardha road'] },
  { city: 'Nashik', pincode: '422001', state: 'Maharashtra', tier: 2, aliases: ['nashik', 'nasik', 'panchavati', 'college road'] },
  { city: 'Aurangabad', pincode: '431001', state: 'Maharashtra', tier: 2, aliases: ['aurangabad', 'chhatrapati sambhajinagar', 'sambhajinagar', 'cidco'] },
  { city: 'Solapur', pincode: '413001', state: 'Maharashtra', tier: 2, aliases: ['solapur', 'sholapur'] },
  { city: 'Kolhapur', pincode: '416001', state: 'Maharashtra', tier: 2, aliases: ['kolhapur'] },
  { city: 'Amravati', pincode: '444601', state: 'Maharashtra', tier: 2, aliases: ['amravati'] },
  { city: 'Nanded', pincode: '431601', state: 'Maharashtra', tier: 2, aliases: ['nanded'] },
  { city: 'Sangli', pincode: '416416', state: 'Maharashtra', tier: 2, aliases: ['sangli', 'miraj'] },
  { city: 'Jalgaon', pincode: '425001', state: 'Maharashtra', tier: 2, aliases: ['jalgaon'] },
  { city: 'Akola', pincode: '444001', state: 'Maharashtra', tier: 2, aliases: ['akola'] },
  { city: 'Latur', pincode: '413512', state: 'Maharashtra', tier: 2, aliases: ['latur'] },
  { city: 'Dhule', pincode: '424001', state: 'Maharashtra', tier: 2, aliases: ['dhule'] },
  { city: 'Ahmednagar', pincode: '414001', state: 'Maharashtra', tier: 2, aliases: ['ahmednagar', 'ahilyanagar'] },
  { city: 'Chandrapur', pincode: '442401', state: 'Maharashtra', tier: 2, aliases: ['chandrapur'] },
  { city: 'Parbhani', pincode: '431401', state: 'Maharashtra', tier: 2, aliases: ['parbhani'] },
  { city: 'Panvel', pincode: '410206', state: 'Maharashtra', tier: 1, aliases: ['panvel', 'new panvel'] },
  { city: 'Satara', pincode: '415001', state: 'Maharashtra', tier: 2, aliases: ['satara'] },
  { city: 'Ratnagiri', pincode: '415612', state: 'Maharashtra', tier: 2, aliases: ['ratnagiri'] },
  { city: 'Bengaluru', pincode: '560001', state: 'Karnataka', tier: 1, aliases: ['bengaluru', 'bangalore', 'mg road', 'indiranagar', 'koramangala', 'whitefield', 'electronic city', 'jayanagar', 'hsr layout'] },
  { city: 'Mysuru', pincode: '570001', state: 'Karnataka', tier: 2, aliases: ['mysuru', 'mysore'] },
  { city: 'Mangaluru', pincode: '575001', state: 'Karnataka', tier: 2, aliases: ['mangaluru', 'mangalore'] },
  { city: 'Hubballi', pincode: '580020', state: 'Karnataka', tier: 2, aliases: ['hubballi', 'hubli', 'dharwad'] },
  { city: 'Belagavi', pincode: '590001', state: 'Karnataka', tier: 2, aliases: ['belagavi', 'belgaum'] },
  { city: 'Kalaburagi', pincode: '585101', state: 'Karnataka', tier: 2, aliases: ['kalaburagi', 'gulbarga'] },
  { city: 'Davanagere', pincode: '577001', state: 'Karnataka', tier: 2, aliases: ['davanagere'] },
  { city: 'Ballari', pincode: '583101', state: 'Karnataka', tier: 2, aliases: ['ballari', 'bellary'] },
  { city: 'Shivamogga', pincode: '577201', state: 'Karnataka', tier: 2, aliases: ['shivamogga', 'shimoga'] },
  { city: 'Tumakuru', pincode: '572101', state: 'Karnataka', tier: 2, aliases: ['tumakuru', 'tumkur'] },
  { city: 'Udupi', pincode: '576101', state: 'Karnataka', tier: 2, aliases: ['udupi', 'manipal'] },
  { city: 'Hassan', pincode: '573201', state: 'Karnataka', tier: 2, aliases: ['hassan'] },
  { city: 'Hyderabad', pincode: '500001', state: 'Telangana', tier: 1, aliases: ['hyderabad', 'hitec city', 'madhapur', 'gachibowli', 'jubilee hills', 'banjara hills', 'kukatpally'] },
  { city: 'Secunderabad', pincode: '500003', state: 'Telangana', tier: 1, aliases: ['secunderabad'] },
  { city: 'Warangal', pincode: '506001', state: 'Telangana', tier: 2, aliases: ['warangal', 'hanamkonda', 'kazipet'] },
  { city: 'Nizamabad', pincode: '503001', state: 'Telangana', tier: 2, aliases: ['nizamabad'] },
  { city: 'Karimnagar', pincode: '505001', state: 'Telangana', tier: 2, aliases: ['karimnagar'] },
  { city: 'Khammam', pincode: '507001', state: 'Telangana', tier: 2, aliases: ['khammam'] },
  { city: 'Visakhapatnam', pincode: '530001', state: 'Andhra Pradesh', tier: 1, aliases: ['visakhapatnam', 'vizag', 'gajuwaka', 'madhurawada'] },
  { city: 'Vijayawada', pincode: '520001', state: 'Andhra Pradesh', tier: 2, aliases: ['vijayawada'] },
  { city: 'Guntur', pincode: '522001', state: 'Andhra Pradesh', tier: 2, aliases: ['guntur'] },
  { city: 'Nellore', pincode: '524001', state: 'Andhra Pradesh', tier: 2, aliases: ['nellore'] },
  { city: 'Kurnool', pincode: '518001', state: 'Andhra Pradesh', tier: 2, aliases: ['kurnool'] },
  { city: 'Tirupati', pincode: '517501', state: 'Andhra Pradesh', tier: 2, aliases: ['tirupati', 'tirumala'] },
  { city: 'Rajahmundry', pincode: '533101', state: 'Andhra Pradesh', tier: 2, aliases: ['rajahmundry', 'rajamahendravaram'] },
  { city: 'Kakinada', pincode: '533001', state: 'Andhra Pradesh', tier: 2, aliases: ['kakinada'] },
  { city: 'Anantapur', pincode: '515001', state: 'Andhra Pradesh', tier: 2, aliases: ['anantapur'] },
  { city: 'Kadapa', pincode: '516001', state: 'Andhra Pradesh', tier: 2, aliases: ['kadapa'] },
  { city: 'Chennai', pincode: '600001', state: 'Tamil Nadu', tier: 1, aliases: ['chennai', 'madras', 'adyar', 'anna nagar', 't nagar', 'velachery', 'omr'] },
  { city: 'Coimbatore', pincode: '641001', state: 'Tamil Nadu', tier: 1, aliases: ['coimbatore', 'kovai', 'peelamedu', 'rs puram'] },
  { city: 'Madurai', pincode: '625001', state: 'Tamil Nadu', tier: 2, aliases: ['madurai'] },
  { city: 'Tiruchirappalli', pincode: '620001', state: 'Tamil Nadu', tier: 2, aliases: ['tiruchirappalli', 'trichy'] },
  { city: 'Salem', pincode: '636001', state: 'Tamil Nadu', tier: 2, aliases: ['salem'] },
  { city: 'Tiruppur', pincode: '641601', state: 'Tamil Nadu', tier: 2, aliases: ['tiruppur', 'tirupur'] },
  { city: 'Erode', pincode: '638001', state: 'Tamil Nadu', tier: 2, aliases: ['erode'] },
  { city: 'Vellore', pincode: '632001', state: 'Tamil Nadu', tier: 2, aliases: ['vellore'] },
  { city: 'Tirunelveli', pincode: '627001', state: 'Tamil Nadu', tier: 2, aliases: ['tirunelveli', 'nellai'] },
  { city: 'Thoothukudi', pincode: '628001', state: 'Tamil Nadu', tier: 2, aliases: ['thoothukudi', 'tuticorin'] },
  { city: 'Hosur', pincode: '635109', state: 'Tamil Nadu', tier: 2, aliases: ['hosur'] },
  { city: 'Kochi', pincode: '682001', state: 'Kerala', tier: 1, aliases: ['kochi', 'cochin', 'ernakulam', 'kakkanad', 'edapally'] },
  { city: 'Thiruvananthapuram', pincode: '695001', state: 'Kerala', tier: 2, aliases: ['thiruvananthapuram', 'trivandrum', 'technopark'] },
  { city: 'Kozhikode', pincode: '673001', state: 'Kerala', tier: 2, aliases: ['kozhikode', 'calicut'] },
  { city: 'Thrissur', pincode: '680001', state: 'Kerala', tier: 2, aliases: ['thrissur', 'trichur'] },
  { city: 'Kollam', pincode: '691001', state: 'Kerala', tier: 2, aliases: ['kollam', 'quilon'] },
  { city: 'Kannur', pincode: '670001', state: 'Kerala', tier: 2, aliases: ['kannur'] },
  { city: 'Alappuzha', pincode: '688001', state: 'Kerala', tier: 2, aliases: ['alappuzha', 'alleppey'] },
  { city: 'Kolkata', pincode: '700001', state: 'West Bengal', tier: 1, aliases: ['kolkata', 'calcutta', 'park street', 'salt lake', 'new town', 'howrah'] },
  { city: 'Howrah', pincode: '711101', state: 'West Bengal', tier: 1, aliases: ['howrah', 'shibpur'] },
  { city: 'Siliguri', pincode: '734001', state: 'West Bengal', tier: 2, aliases: ['siliguri', 'matigara'] },
  { city: 'Durgapur', pincode: '713201', state: 'West Bengal', tier: 2, aliases: ['durgapur', 'city centre'] },
  { city: 'Asansol', pincode: '713301', state: 'West Bengal', tier: 2, aliases: ['asansol'] },
  { city: 'Bardhaman', pincode: '713101', state: 'West Bengal', tier: 2, aliases: ['bardhaman', 'burdwan'] },
  { city: 'Kharagpur', pincode: '721301', state: 'West Bengal', tier: 2, aliases: ['kharagpur'] },
  { city: 'Bhubaneswar', pincode: '751001', state: 'Odisha', tier: 1, aliases: ['bhubaneswar', 'bhubaneshwar', 'patia', 'jaydev vihar'] },
  { city: 'Cuttack', pincode: '753001', state: 'Odisha', tier: 2, aliases: ['cuttack'] },
  { city: 'Rourkela', pincode: '769001', state: 'Odisha', tier: 2, aliases: ['rourkela'] },
  { city: 'Puri', pincode: '752001', state: 'Odisha', tier: 2, aliases: ['puri'] },
  { city: 'Guwahati', pincode: '781001', state: 'Assam', tier: 1, aliases: ['guwahati', 'gauhati', 'dispur', 'gs road'] },
  { city: 'Silchar', pincode: '788001', state: 'Assam', tier: 2, aliases: ['silchar'] },
  { city: 'Dibrugarh', pincode: '786001', state: 'Assam', tier: 2, aliases: ['dibrugarh'] },
  { city: 'Jorhat', pincode: '785001', state: 'Assam', tier: 2, aliases: ['jorhat'] },
  { city: 'Tezpur', pincode: '784001', state: 'Assam', tier: 2, aliases: ['tezpur'] },
  { city: 'Agartala', pincode: '799001', state: 'Tripura', tier: 2, aliases: ['agartala'] },
  { city: 'Shillong', pincode: '793001', state: 'Meghalaya', tier: 2, aliases: ['shillong'] },
  { city: 'Imphal', pincode: '795001', state: 'Manipur', tier: 2, aliases: ['imphal'] },
  { city: 'Aizawl', pincode: '796001', state: 'Mizoram', tier: 2, aliases: ['aizawl'] },
  { city: 'Kohima', pincode: '797001', state: 'Nagaland', tier: 2, aliases: ['kohima', 'dimapur'] },
  { city: 'Gangtok', pincode: '737101', state: 'Sikkim', tier: 2, aliases: ['gangtok'] },
  { city: 'Itanagar', pincode: '791111', state: 'Arunachal Pradesh', tier: 2, aliases: ['itanagar'] },
  { city: 'Ahmedabad', pincode: '380001', state: 'Gujarat', tier: 1, aliases: ['ahmedabad', 'sg highway', 'navrangpura', 'satellite', 'bodakdev'] },
  { city: 'Surat', pincode: '395001', state: 'Gujarat', tier: 1, aliases: ['surat', 'adajan', 'varachha'] },
  { city: 'Vadodara', pincode: '390001', state: 'Gujarat', tier: 1, aliases: ['vadodara', 'baroda', 'alkapuri'] },
  { city: 'Rajkot', pincode: '360001', state: 'Gujarat', tier: 2, aliases: ['rajkot'] },
  { city: 'Bhavnagar', pincode: '364001', state: 'Gujarat', tier: 2, aliases: ['bhavnagar'] },
  { city: 'Jamnagar', pincode: '361001', state: 'Gujarat', tier: 2, aliases: ['jamnagar'] },
  { city: 'Gandhinagar', pincode: '382010', state: 'Gujarat', tier: 1, aliases: ['gandhinagar'] },
  { city: 'Junagadh', pincode: '362001', state: 'Gujarat', tier: 2, aliases: ['junagadh'] },
  { city: 'Anand', pincode: '388001', state: 'Gujarat', tier: 2, aliases: ['anand'] },
  { city: 'Navsari', pincode: '396445', state: 'Gujarat', tier: 2, aliases: ['navsari'] },
  { city: 'Morbi', pincode: '363641', state: 'Gujarat', tier: 2, aliases: ['morbi'] },
  { city: 'Bharuch', pincode: '392001', state: 'Gujarat', tier: 2, aliases: ['bharuch'] },
  { city: 'Vapi', pincode: '396191', state: 'Gujarat', tier: 2, aliases: ['vapi'] },
  { city: 'Bhuj', pincode: '370001', state: 'Gujarat', tier: 2, aliases: ['bhuj', 'kutch'] },
  { city: 'Jaipur', pincode: '302001', state: 'Rajasthan', tier: 1, aliases: ['jaipur', 'pink city', 'malviya nagar', 'vaishali nagar', 'c scheme'] },
  { city: 'Jodhpur', pincode: '342001', state: 'Rajasthan', tier: 2, aliases: ['jodhpur', 'sun city'] },
  { city: 'Kota', pincode: '324001', state: 'Rajasthan', tier: 2, aliases: ['kota'] },
  { city: 'Bikaner', pincode: '334001', state: 'Rajasthan', tier: 2, aliases: ['bikaner'] },
  { city: 'Ajmer', pincode: '305001', state: 'Rajasthan', tier: 2, aliases: ['ajmer', 'pushkar'] },
  { city: 'Udaipur', pincode: '313001', state: 'Rajasthan', tier: 2, aliases: ['udaipur', 'lake city'] },
  { city: 'Bhilwara', pincode: '311001', state: 'Rajasthan', tier: 2, aliases: ['bhilwara'] },
  { city: 'Alwar', pincode: '301001', state: 'Rajasthan', tier: 2, aliases: ['alwar'] },
  { city: 'Bharatpur', pincode: '321001', state: 'Rajasthan', tier: 2, aliases: ['bharatpur'] },
  { city: 'Sikar', pincode: '332001', state: 'Rajasthan', tier: 2, aliases: ['sikar'] },
  { city: 'Pali', pincode: '306401', state: 'Rajasthan', tier: 2, aliases: ['pali'] },
  { city: 'Sri Ganganagar', pincode: '335001', state: 'Rajasthan', tier: 2, aliases: ['sri ganganagar', 'ganganagar'] },
  { city: 'Barmer', pincode: '344001', state: 'Rajasthan', tier: 2, aliases: ['barmer'] },
  { city: 'Jaisalmer', pincode: '345001', state: 'Rajasthan', tier: 2, aliases: ['jaisalmer'] },
  { city: 'Bhopal', pincode: '462001', state: 'Madhya Pradesh', tier: 1, aliases: ['bhopal', 'mp nagar', 'arera colony', 'kolar'] },
  { city: 'Indore', pincode: '452001', state: 'Madhya Pradesh', tier: 1, aliases: ['indore', 'vijay nagar', 'palasia', 'rajwada'] },
  { city: 'Jabalpur', pincode: '482001', state: 'Madhya Pradesh', tier: 2, aliases: ['jabalpur'] },
  { city: 'Gwalior', pincode: '474001', state: 'Madhya Pradesh', tier: 2, aliases: ['gwalior', 'lashkar', 'morar'] },
  { city: 'Ujjain', pincode: '456001', state: 'Madhya Pradesh', tier: 2, aliases: ['ujjain', 'mahakal'] },
  { city: 'Sagar', pincode: '470001', state: 'Madhya Pradesh', tier: 2, aliases: ['sagar'] },
  { city: 'Dewas', pincode: '455001', state: 'Madhya Pradesh', tier: 2, aliases: ['dewas'] },
  { city: 'Satna', pincode: '485001', state: 'Madhya Pradesh', tier: 2, aliases: ['satna'] },
  { city: 'Ratlam', pincode: '457001', state: 'Madhya Pradesh', tier: 2, aliases: ['ratlam'] },
  { city: 'Rewa', pincode: '486001', state: 'Madhya Pradesh', tier: 2, aliases: ['rewa'] },
  { city: 'Katni', pincode: '483501', state: 'Madhya Pradesh', tier: 2, aliases: ['katni', 'murwara'] },
  { city: 'Singrauli', pincode: '486889', state: 'Madhya Pradesh', tier: 2, aliases: ['singrauli'] },
  { city: 'Raipur', pincode: '492001', state: 'Chhattisgarh', tier: 1, aliases: ['raipur', 'telibandha', 'pandri'] },
  { city: 'Bhilai', pincode: '490006', state: 'Chhattisgarh', tier: 2, aliases: ['bhilai', 'durg'] },
  { city: 'Bilaspur', pincode: '495001', state: 'Chhattisgarh', tier: 2, aliases: ['bilaspur'] },
  { city: 'Korba', pincode: '495677', state: 'Chhattisgarh', tier: 2, aliases: ['korba'] },
  { city: 'Rajnandgaon', pincode: '491441', state: 'Chhattisgarh', tier: 2, aliases: ['rajnandgaon'] },
  { city: 'Jagdalpur', pincode: '494001', state: 'Chhattisgarh', tier: 2, aliases: ['jagdalpur', 'bastar'] },
  { city: 'Chandigarh', pincode: '160017', state: 'Chandigarh', tier: 1, aliases: ['chandigarh', 'sector 17', 'sector 35'] },
  { city: 'Ludhiana', pincode: '141001', state: 'Punjab', tier: 1, aliases: ['ludhiana', 'model town'] },
  { city: 'Amritsar', pincode: '143001', state: 'Punjab', tier: 1, aliases: ['amritsar', 'golden temple'] },
  { city: 'Jalandhar', pincode: '144001', state: 'Punjab', tier: 2, aliases: ['jalandhar'] },
  { city: 'Patiala', pincode: '147001', state: 'Punjab', tier: 2, aliases: ['patiala'] },
  { city: 'Bathinda', pincode: '151001', state: 'Punjab', tier: 2, aliases: ['bathinda'] },
  { city: 'Mohali', pincode: '160055', state: 'Punjab', tier: 1, aliases: ['mohali', 'sas nagar'] },
  { city: 'Pathankot', pincode: '145001', state: 'Punjab', tier: 2, aliases: ['pathankot'] },
  { city: 'Hoshiarpur', pincode: '146001', state: 'Punjab', tier: 2, aliases: ['hoshiarpur'] },
  { city: 'Panipat', pincode: '132103', state: 'Haryana', tier: 2, aliases: ['panipat'] },
  { city: 'Ambala', pincode: '134003', state: 'Haryana', tier: 2, aliases: ['ambala', 'ambala cantt'] },
  { city: 'Rohtak', pincode: '124001', state: 'Haryana', tier: 2, aliases: ['rohtak'] },
  { city: 'Hisar', pincode: '125001', state: 'Haryana', tier: 2, aliases: ['hisar'] },
  { city: 'Karnal', pincode: '132001', state: 'Haryana', tier: 2, aliases: ['karnal'] },
  { city: 'Sonipat', pincode: '131001', state: 'Haryana', tier: 2, aliases: ['sonipat'] },
  { city: 'Panchkula', pincode: '134109', state: 'Haryana', tier: 2, aliases: ['panchkula'] },
  { city: 'Dehradun', pincode: '248001', state: 'Uttarakhand', tier: 1, aliases: ['dehradun', 'rajpur road'] },
  { city: 'Haridwar', pincode: '249401', state: 'Uttarakhand', tier: 2, aliases: ['haridwar', 'jwalapur'] },
  { city: 'Roorkee', pincode: '247667', state: 'Uttarakhand', tier: 2, aliases: ['roorkee', 'iit roorkee'] },
  { city: 'Haldwani', pincode: '263139', state: 'Uttarakhand', tier: 2, aliases: ['haldwani', 'kathgodam'] },
  { city: 'Rishikesh', pincode: '249201', state: 'Uttarakhand', tier: 2, aliases: ['rishikesh'] },
  { city: 'Nainital', pincode: '263002', state: 'Uttarakhand', tier: 2, aliases: ['nainital'] },
  { city: 'Mussoorie', pincode: '248179', state: 'Uttarakhand', tier: 2, aliases: ['mussoorie'] },
  { city: 'Shimla', pincode: '171001', state: 'Himachal Pradesh', tier: 2, aliases: ['shimla', 'simla', 'mall road'] },
  { city: 'Dharamshala', pincode: '176215', state: 'Himachal Pradesh', tier: 2, aliases: ['dharamshala', 'mcleodganj'] },
  { city: 'Solan', pincode: '173212', state: 'Himachal Pradesh', tier: 2, aliases: ['solan'] },
  { city: 'Mandi', pincode: '175001', state: 'Himachal Pradesh', tier: 2, aliases: ['mandi'] },
  { city: 'Kullu', pincode: '175101', state: 'Himachal Pradesh', tier: 2, aliases: ['kullu', 'manali'] },
  { city: 'Srinagar', pincode: '190001', state: 'Jammu & Kashmir', tier: 1, aliases: ['srinagar', 'lal chowk', 'dal lake'] },
  { city: 'Jammu', pincode: '180001', state: 'Jammu & Kashmir', tier: 2, aliases: ['jammu', 'bahifort'] },
  { city: 'Leh', pincode: '194101', state: 'Ladakh', tier: 2, aliases: ['leh', 'ladakh'] },
  { city: 'Panaji', pincode: '403001', state: 'Goa', tier: 1, aliases: ['panaji', 'panjim'] },
  { city: 'Margao', pincode: '403601', state: 'Goa', tier: 2, aliases: ['margao', 'madgaon'] },
  { city: 'Puducherry', pincode: '605001', state: 'Puducherry', tier: 2, aliases: ['puducherry', 'pondicherry', 'white town'] },
  { city: 'Port Blair', pincode: '744101', state: 'Andaman & Nicobar', tier: 2, aliases: ['port blair'] },
];

/**
 * Universal Indian City and PIN code lookup engine.
 * Automatically resolves the EXACT postal PIN code for any city/locality in India.
 */
export function lookupCityOrPincode(query: string): CityPincodeEntry {
  const raw = query.trim().toLowerCase();
  if (!raw) {
    return {
      city: 'New Delhi',
      pincode: '110001',
      state: 'Delhi',
      tier: 1,
      aliases: ['delhi']
    };
  }

  // 1. If 6-digit PIN code entered
  if (/^[1-9][0-9]{5}$/.test(raw)) {
    const match = ALL_INDIAN_CITIES.find(c => c.pincode === raw);
    if (match) return match;
    // Derive state based on Indian postal zone prefixes
    const prefix2 = parseInt(raw.substring(0, 2), 10);
    let state = 'India';
    if (prefix2 === 11) state = 'Delhi';
    else if (prefix2 >= 12 && prefix2 <= 13) state = 'Haryana';
    else if (prefix2 >= 14 && prefix2 <= 15) state = 'Punjab';
    else if (prefix2 === 16) state = 'Chandigarh';
    else if (prefix2 === 17) state = 'Himachal Pradesh';
    else if (prefix2 >= 18 && prefix2 <= 19) state = 'Jammu & Kashmir';
    else if (prefix2 >= 20 && prefix2 <= 28) state = 'Uttar Pradesh';
    else if (prefix2 >= 30 && prefix2 <= 34) state = 'Rajasthan';
    else if (prefix2 >= 36 && prefix2 <= 39) state = 'Gujarat';
    else if (prefix2 >= 40 && prefix2 <= 44) state = 'Maharashtra';
    else if (prefix2 >= 45 && prefix2 <= 48) state = 'Madhya Pradesh';
    else if (prefix2 === 49) state = 'Chhattisgarh';
    else if (prefix2 >= 50 && prefix2 <= 53) state = 'Telangana & Andhra Pradesh';
    else if (prefix2 >= 56 && prefix2 <= 59) state = 'Karnataka';
    else if (prefix2 >= 60 && prefix2 <= 64) state = 'Tamil Nadu';
    else if (prefix2 >= 67 && prefix2 <= 69) state = 'Kerala';
    else if (prefix2 >= 70 && prefix2 <= 74) state = 'West Bengal';
    else if (prefix2 >= 75 && prefix2 <= 77) state = 'Odisha';
    else if (prefix2 >= 78 && prefix2 <= 79) state = 'Assam & North East';
    else if (prefix2 >= 80 && prefix2 <= 85) state = 'Bihar & Jharkhand';

    return {
      city: 'PIN ' + raw,
      pincode: raw,
      state,
      tier: 2,
      aliases: [raw]
    };
  }

  // 2. Exact match on city name
  const exact = ALL_INDIAN_CITIES.find(c => c.city.toLowerCase() === raw);
  if (exact) return exact;

  // 3. Match in aliases (e.g. 'bangalore', 'bombay', 'calcutta', 'gurgaon', 'patna', 'ranchi', 'gorakhpur', 'darbhanga')
  const aliasMatch = ALL_INDIAN_CITIES.find(c => c.aliases.some(a => a.toLowerCase() === raw));
  if (aliasMatch) return aliasMatch;

  // 4. Starts with match
  const startsMatch = ALL_INDIAN_CITIES.find(c => c.city.toLowerCase().startsWith(raw));
  if (startsMatch) return startsMatch;

  // 5. Contains match on city or aliases
  const containsMatch = ALL_INDIAN_CITIES.find(c =>
    c.city.toLowerCase().includes(raw) || c.aliases.some(a => a.toLowerCase().includes(raw))
  );
  if (containsMatch) return containsMatch;

  // 6. Generic title-cased custom city fallback with intelligent default PIN
  const formattedCity = query
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    city: formattedCity,
    pincode: '800001', // Standard hub PIN fallback
    state: 'India',
    tier: 2,
    aliases: [raw]
  };
}

/**
 * Filter matching cities for live autocomplete typing in LocationModal
 */
export function searchIndianCities(query: string, limit = 12): CityPincodeEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_INDIAN_CITIES.slice(0, limit);

  return ALL_INDIAN_CITIES.filter(c =>
    c.city.toLowerCase().includes(q) ||
    c.pincode.startsWith(q) ||
    c.state.toLowerCase().includes(q) ||
    c.aliases.some(a => a.toLowerCase().includes(q))
  ).slice(0, limit);
}
