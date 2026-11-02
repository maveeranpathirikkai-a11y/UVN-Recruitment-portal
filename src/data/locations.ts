import { StateItem } from '../types';

export const LOCATION_MASTER_DATA: StateItem[] = [
  {
    id: 'tamil_nadu',
    nameEn: 'Tamil Nadu',
    nameTa: 'தமிழ்நாடு',
    districts: [
      {
        id: 'ariyalur',
        nameEn: 'Ariyalur',
        nameTa: 'அரியலூர்',
        taluks: [
          { nameEn: 'Ariyalur', nameTa: 'அரியலூர்' },
          { nameEn: 'Sendurai', nameTa: 'செந்துறை' },
          { nameEn: 'Udayarpalayam', nameTa: 'உடையார்பாளையம்' },
          { nameEn: 'Andimadam', nameTa: 'ஆண்டிமடம்' }
        ]
      },
      {
        id: 'chengalpattu',
        nameEn: 'Chengalpattu',
        nameTa: 'செங்கல்பட்டு',
        taluks: [
          { nameEn: 'Chengalpattu', nameTa: 'செங்கல்பட்டு' },
          { nameEn: 'Tambaram', nameTa: 'தாம்பரம்' },
          { nameEn: 'Pallavaram', nameTa: 'பல்லாவரம்' },
          { nameEn: 'Maduranthakam', nameTa: 'மதுராந்தகம்' },
          { nameEn: 'Cheyyur', nameTa: 'செய்யூர்' },
          { nameEn: 'Tiruporur', nameTa: 'திருப்போரூர்' },
          { nameEn: 'Vandalur', nameTa: 'வண்டலூர்' },
          { nameEn: 'Kundrathur', nameTa: 'குன்றத்தூர்' }
        ]
      },
      {
        id: 'chennai',
        nameEn: 'Chennai',
        nameTa: 'சென்னை',
        taluks: [
          { nameEn: 'Egmore', nameTa: 'எழும்பூர்' },
          { nameEn: 'Guindy', nameTa: 'கிண்டி' },
          { nameEn: 'Mylapore', nameTa: 'மயிலாப்பூர்' },
          { nameEn: 'Tondiarpet', nameTa: 'தண்டையார்பேட்டை' },
          { nameEn: 'Velachery', nameTa: 'வேளச்சேரி' },
          { nameEn: 'Aminjikarai', nameTa: 'அமைந்தகரை' },
          { nameEn: 'Ayanavaram', nameTa: 'அயனாவரம்' },
          { nameEn: 'Mambalam', nameTa: 'மாம்பலம்' },
          { nameEn: 'Perambur', nameTa: 'பெரம்பூர்' },
          { nameEn: 'Purasawalkam', nameTa: 'புரசைவாக்கம்' },
          { nameEn: 'Sholinganallur', nameTa: 'சோழிங்கநல்லூர்' },
          { nameEn: 'Alandur', nameTa: 'ஆலந்தூர்' },
          { nameEn: 'Madhavaram', nameTa: 'மாதவரம்' },
          { nameEn: 'Thiruvottiyur', nameTa: 'திருவொற்றியூர்' },
          { nameEn: 'Maduravoyal', nameTa: 'மதுரவாயல்' },
          { nameEn: 'Thiruvikanagar', nameTa: 'திரு.வி.க. நகர்' }
        ]
      },
      {
        id: 'coimbatore',
        nameEn: 'Coimbatore',
        nameTa: 'கோயம்புத்தூர்',
        taluks: [
          { nameEn: 'Coimbatore North', nameTa: 'கோயம்புத்தூர் வடக்கு' },
          { nameEn: 'Coimbatore South', nameTa: 'கோயம்புத்தூர் தெற்கு' },
          { nameEn: 'Pollachi', nameTa: 'பொள்ளாச்சி' },
          { nameEn: 'Mettupalayam', nameTa: 'மேட்டுப்பாளையம்' },
          { nameEn: 'Sulur', nameTa: 'சூலூர்' },
          { nameEn: 'Annur', nameTa: 'அன்னூர்' },
          { nameEn: 'Kinathukadavu', nameTa: 'கிணத்துக்கடவு' },
          { nameEn: 'Valparai', nameTa: 'வால்பாறை' },
          { nameEn: 'Perur', nameTa: 'பேரூர்' },
          { nameEn: 'Madukkarai', nameTa: 'மதுக்கரை' },
          { nameEn: 'Anaimalai', nameTa: 'ஆனைமலை' }
        ]
      },
      {
        id: 'cuddalore',
        nameEn: 'Cuddalore',
        nameTa: 'கடலூர்',
        taluks: [
          { nameEn: 'Cuddalore', nameTa: 'கடலூர்' },
          { nameEn: 'Chidambaram', nameTa: 'சிதம்பரம்' },
          { nameEn: 'Panruti', nameTa: 'பண்ருட்டி' },
          { nameEn: 'Vriddhachalam', nameTa: 'விருத்தாச்சலம்' },
          { nameEn: 'Kattumannarkoil', nameTa: 'காட்டுமன்னார்கோயில்' },
          { nameEn: 'Kurinjipadi', nameTa: 'குறிஞ்சிப்பாடி' },
          { nameEn: 'Tittakudi', nameTa: 'திட்டக்குடி' },
          { nameEn: 'Veppur', nameTa: 'வேப்பூர்' },
          { nameEn: 'Srimushnam', nameTa: 'ஸ்ரீமுஷ்ணம்' }
        ]
      },
      {
        id: 'dharmapuri',
        nameEn: 'Dharmapuri',
        nameTa: 'தருமபுரி',
        taluks: [
          { nameEn: 'Dharmapuri', nameTa: 'தருமபுரி' },
          { nameEn: 'Harur', nameTa: 'அரூர்' },
          { nameEn: 'Palakkodu', nameTa: 'பாலக்கோடு' },
          { nameEn: 'Pennagaram', nameTa: 'பெPennagaram' },
          { nameEn: 'Pappireddipatti', nameTa: 'பாப்பிரெட்டிப்பட்டி' },
          { nameEn: 'Karimangalam', nameTa: 'காரிமங்கலம்' },
          { nameEn: 'Nallampalli', nameTa: 'நல்லம்பள்ளி' }
        ]
      },
      {
        id: 'dindigul',
        nameEn: 'Dindigul',
        nameTa: 'திண்டுக்கல்',
        taluks: [
          { nameEn: 'Dindigul East', nameTa: 'திண்டுக்கல் கிழக்கு' },
          { nameEn: 'Dindigul West', nameTa: 'திண்டுக்கல் மேற்கு' },
          { nameEn: 'Palani', nameTa: 'பழனி' },
          { nameEn: 'Kodaikanal', nameTa: 'கொடைக்கானல்' },
          { nameEn: 'Natham', nameTa: 'நத்தம்' },
          { nameEn: 'Nilakottai', nameTa: 'நிலக்கோட்டை' },
          { nameEn: 'Oddanchatram', nameTa: 'ஒட்டன்சத்திரம்' },
          { nameEn: 'Vedasandur', nameTa: 'வேடசந்தூர்' },
          { nameEn: 'Gujiliamparai', nameTa: 'குஜிலியம்பாறை' }
        ]
      },
      {
        id: 'erode',
        nameEn: 'Erode',
        nameTa: 'ஈரோடு',
        taluks: [
          { nameEn: 'Erode', nameTa: 'ஈரோடு' },
          { nameEn: 'Bhavani', nameTa: 'பவானி' },
          { nameEn: 'Gobichettipalayam', nameTa: 'கோபிசெட்டிபாளையம்' },
          { nameEn: 'Perundurai', nameTa: 'பெருந்துறை' },
          { nameEn: 'Sathyamangalam', nameTa: 'சத்தியமங்கலம்' },
          { nameEn: 'Anthiyur', nameTa: 'அந்தியூர்' },
          { nameEn: 'Modakkurichi', nameTa: 'மொடக்குறிச்சி' },
          { nameEn: 'Kodumudi', nameTa: 'கொடுமுடி' },
          { nameEn: 'Thalavadi', nameTa: 'தாளவாடி' }
        ]
      },
      {
        id: 'kallakurichi',
        nameEn: 'Kallakurichi',
        nameTa: 'கள்ளக்குறிச்சி',
        taluks: [
          { nameEn: 'Kallakurichi', nameTa: 'கள்ளக்குறிச்சி' },
          { nameEn: 'Sankarapuram', nameTa: 'சங்கராபுரம்' },
          { nameEn: 'Tirukkovilur', nameTa: 'திருக்கோவிலூர்' },
          { nameEn: 'Ulundurpet', nameTa: 'உளுந்தூர்பேட்டை' },
          { nameEn: 'Chinnasalem', nameTa: 'சின்னசேலம்' },
          { nameEn: 'Kalvarayan Hills', nameTa: 'கல்வராயன் மலை' }
        ]
      },
      {
        id: 'kanchipuram',
        nameEn: 'Kanchipuram',
        nameTa: 'காஞ்சிபுரம்',
        taluks: [
          { nameEn: 'Kanchipuram', nameTa: 'காஞ்சிபுரம்' },
          { nameEn: 'Sriperumbudur', nameTa: 'ஸ்ரீபெரும்புதூர்' },
          { nameEn: 'Uthiramerur', nameTa: 'உத்திரமேரூர்' },
          { nameEn: 'Walajabad', nameTa: 'வாலாஜாபாத்' },
          { nameEn: 'Kundrathur', nameTa: 'குன்றத்தூர்' }
        ]
      },
      {
        id: 'kanyakumari',
        nameEn: 'Kanyakumari',
        nameTa: 'கன்னியாகுமரி',
        taluks: [
          { nameEn: 'Agastheeswaram', nameTa: 'அகத்தீஸ்வரம்' },
          { nameEn: 'Kalkulam', nameTa: 'கல்குளம்' },
          { nameEn: 'Thovalai', nameTa: 'தோவாளை' },
          { nameEn: 'Vilavancode', nameTa: 'விளவங்கோடு' },
          { nameEn: 'Killiyoor', nameTa: 'கிள்ளியூர்' },
          { nameEn: 'Thiruvattar', nameTa: 'திருவட்டார்' }
        ]
      },
      {
        id: 'karur',
        nameEn: 'Karur',
        nameTa: 'கரூர்',
        taluks: [
          { nameEn: 'Karur', nameTa: 'கரூர்' },
          { nameEn: 'Kulithalai', nameTa: 'குளித்தலை' },
          { nameEn: 'Aravakurichi', nameTa: 'அரவக்குறிச்சி' },
          { nameEn: 'Krishnarayapuram', nameTa: 'கிருஷ்ணராயபுரம்' },
          { nameEn: 'Kadavur', nameTa: 'கடவூர்' },
          { nameEn: 'Manmangalam', nameTa: 'மண்மங்கலம்' },
          { nameEn: 'Pugalur', nameTa: 'புகழூர்' }
        ]
      },
      {
        id: 'krishnagiri',
        nameEn: 'Krishnagiri',
        nameTa: 'கிருஷ்ணகிரி',
        taluks: [
          { nameEn: 'Krishnagiri', nameTa: 'கிருஷ்ணகிரி' },
          { nameEn: 'Hosur', nameTa: 'ஓசூர்' },
          { nameEn: 'Pochampalli', nameTa: 'போச்சம்பள்ளி' },
          { nameEn: 'Uthangarai', nameTa: 'ஊத்தங்கரை' },
          { nameEn: 'Denkanikottai', nameTa: 'தேன்கனிக்கோட்டை' },
          { nameEn: 'Bargur', nameTa: 'பர்கூர்' },
          { nameEn: 'Shoolagiri', nameTa: 'சூளகிரி' },
          { nameEn: 'Anchetty', nameTa: 'அஞ்செட்டி' }
        ]
      },
      {
        id: 'madurai',
        nameEn: 'Madurai',
        nameTa: 'மதுரை',
        taluks: [
          { nameEn: 'Madurai North', nameTa: 'மதுரை வடக்கு' },
          { nameEn: 'Madurai South', nameTa: 'மதுரை தெற்கு' },
          { nameEn: 'Madurai East', nameTa: 'மதுரை கிழக்கு' },
          { nameEn: 'Madurai West', nameTa: 'மதுரை மேற்கு' },
          { nameEn: 'Melur', nameTa: 'மேலூர்' },
          { nameEn: 'Thirumangalam', nameTa: 'திருமங்கலம்' },
          { nameEn: 'Usilampatti', nameTa: 'உசிலம்பட்டி' },
          { nameEn: 'Vadipatti', nameTa: 'வாடிப்பட்டி' },
          { nameEn: 'Peraiyur', nameTa: 'பேரையூர்' },
          { nameEn: 'Thiruparankundram', nameTa: 'திருப்பரங்குன்றம்' },
          { nameEn: 'Kalligudi', nameTa: 'கள்ளிக்குடி' }
        ]
      },
      {
        id: 'mayiladuthurai',
        nameEn: 'Mayiladuthurai',
        nameTa: 'மயிலாடுதுறை',
        taluks: [
          { nameEn: 'Mayiladuthurai', nameTa: 'மயிலாடுதுறை' },
          { nameEn: 'Sirkazhi', nameTa: 'சீர்காழி' },
          { nameEn: 'Tharangambadi', nameTa: 'தரங்கம்பாடி' },
          { nameEn: 'Kuthalam', nameTa: 'குத்தாலம்' }
        ]
      },
      {
        id: 'nagapattinam',
        nameEn: 'Nagapattinam',
        nameTa: 'நாகப்பட்டினம்',
        taluks: [
          { nameEn: 'Nagapattinam', nameTa: 'நாகப்பட்டினம்' },
          { nameEn: 'Kilvelur', nameTa: 'கீழ்வேளூர்' },
          { nameEn: 'Vedaranyam', nameTa: 'வேதாரண்யம்' },
          { nameEn: 'Thirukkuvalai', nameTa: 'திருக்குவளை' }
        ]
      },
      {
        id: 'namakkal',
        nameEn: 'Namakkal',
        nameTa: 'நாமக்கல்',
        taluks: [
          { nameEn: 'Namakkal', nameTa: 'நாமக்கல்' },
          { nameEn: 'Rasipuram', nameTa: 'ராசிபுரம்' },
          { nameEn: 'Tiruchengode', nameTa: 'திருச்செங்கோடு' },
          { nameEn: 'Paramathi Velur', nameTa: 'பரமத்தி வேலூர்' },
          { nameEn: 'Kolli Hills', nameTa: 'கொல்லிமலை' },
          { nameEn: 'Sendamangalam', nameTa: 'சேந்தமங்கலம்' },
          { nameEn: 'Kumarapalayam', nameTa: 'குமாரபாளையம்' },
          { nameEn: 'Mohanur', nameTa: 'மோகனூர்' }
        ]
      },
      {
        id: 'nilgiris',
        nameEn: 'Nilgiris',
        nameTa: 'நீலகிரி',
        taluks: [
          { nameEn: 'Udhagamandalam (Ooty)', nameTa: 'உதகமண்டலம் (ஊட்டி)' },
          { nameEn: 'Coonoor', nameTa: 'குன்னூர்' },
          { nameEn: 'Kotagiri', nameTa: 'கோத்தகிரி' },
          { nameEn: 'Gudalur', nameTa: 'கூடலூர்' },
          { nameEn: 'Pandalur', nameTa: 'பந்தலூர்' },
          { nameEn: 'Kundah', nameTa: 'குந்தா' }
        ]
      },
      {
        id: 'perambalur',
        nameEn: 'Perambalur',
        nameTa: 'பெரம்பலூர்',
        taluks: [
          { nameEn: 'Perambalur', nameTa: 'பெரம்பலூர்' },
          { nameEn: 'Kunnam', nameTa: 'குன்னம்' },
          { nameEn: 'Veppanthattai', nameTa: 'வேப்பந்தட்டை' },
          { nameEn: 'Alathur', nameTa: 'ஆலத்தூர்' }
        ]
      },
      {
        id: 'pudukkottai',
        nameEn: 'Pudukkottai',
        nameTa: 'புதுக்கோட்டை',
        taluks: [
          { nameEn: 'Pudukkottai', nameTa: 'புதுக்கோட்டை' },
          { nameEn: 'Aranthangi', nameTa: 'அறந்தாங்கி' },
          { nameEn: 'Alangudi', nameTa: 'ஆலங்குடி' },
          { nameEn: 'Illuppur', nameTa: 'இலுப்பூர்' },
          { nameEn: 'Kulathur', nameTa: 'குளத்தூர்' },
          { nameEn: 'Thirumayam', nameTa: 'திருமயம்' },
          { nameEn: 'Gandarvakottai', nameTa: 'கந்தர்வக்கோட்டை' },
          { nameEn: 'Avudaiyarkoil', nameTa: 'ஆவுடையார்கோவில்' },
          { nameEn: 'Manamelkudi', nameTa: 'மணமேல்குடி' },
          { nameEn: 'Ponnamaravathi', nameTa: 'பொன்னமராவதி' },
          { nameEn: 'Karambakkudi', nameTa: 'கறம்பக்குடி' },
          { nameEn: 'Viralimalai', nameTa: 'விராலிமலை' }
        ]
      },
      {
        id: 'ramanathapuram',
        nameEn: 'Ramanathapuram',
        nameTa: 'இராமநாதபுரம்',
        taluks: [
          { nameEn: 'Ramanathapuram', nameTa: 'இராமநாதபுரம்' },
          { nameEn: 'Rameswaram', nameTa: 'ராமேஸ்வரம்' },
          { nameEn: 'Paramakudi', nameTa: 'பரமக்குடி' },
          { nameEn: 'Tiruvadanai', nameTa: 'திருவாடானை' },
          { nameEn: 'Mudukulathur', nameTa: 'முதுகுளத்தூர்' },
          { nameEn: 'Kamuthi', nameTa: 'கமுதி' },
          { nameEn: 'Kadaladi', nameTa: 'கடலாடி' },
          { nameEn: 'Kilakarai', nameTa: 'கீழக்கரை' },
          { nameEn: 'Rajasingamangalam', nameTa: 'ராஜசிங்கமங்கலம்' }
        ]
      },
      {
        id: 'ranipet',
        nameEn: 'Ranipet',
        nameTa: 'ராணிப்பேட்டை',
        taluks: [
          { nameEn: 'Ranipet', nameTa: 'ராணிப்பேட்டை' },
          { nameEn: 'Walajah', nameTa: 'வாலாஜா' },
          { nameEn: 'Arcot', nameTa: 'ஆற்காடு' },
          { nameEn: 'Arakkonam', nameTa: 'அரக்கோணம்' },
          { nameEn: 'Nemili', nameTa: 'நெமிலி' },
          { nameEn: 'Kalavai', nameTa: 'கலவை' }
        ]
      },
      {
        id: 'salem',
        nameEn: 'Salem',
        nameTa: 'சேலம்',
        taluks: [
          { nameEn: 'Salem', nameTa: 'சேலம்' },
          { nameEn: 'Salem South', nameTa: 'சேலம் தெற்கு' },
          { nameEn: 'Salem West', nameTa: 'சேலம் மேற்கு' },
          { nameEn: 'Attur', nameTa: 'ஆத்தூர்' },
          { nameEn: 'Mettur', nameTa: 'மேட்டூர்' },
          { nameEn: 'Omalur', nameTa: 'ஓமலூர்' },
          { nameEn: 'Sankari', nameTa: 'சங்ககிரி' },
          { nameEn: 'Gangavalli', nameTa: 'கங்கவள்ளி' },
          { nameEn: 'Valapady', nameTa: 'வாழப்பாடி' },
          { nameEn: 'Yercaud', nameTa: 'ஏற்காடு' },
          { nameEn: 'Edappadi', nameTa: 'எடப்பாடி' },
          { nameEn: 'Kadayampatti', nameTa: 'காடையாம்பட்டி' },
          { nameEn: 'Pethanaickenpalayam', nameTa: 'பெத்தநாயக்கன்பாளையம்' }
        ]
      },
      {
        id: 'sivaganga',
        nameEn: 'Sivaganga',
        nameTa: 'சிவகங்கை',
        taluks: [
          { nameEn: 'Sivaganga', nameTa: 'சிவகங்கை' },
          { nameEn: 'Karaikudi', nameTa: 'காரைக்குடி' },
          { nameEn: 'Devakottai', nameTa: 'தேவகோட்டை' },
          { nameEn: 'Manamadurai', nameTa: 'மானாமதுரை' },
          { nameEn: 'Tiruppuvanam', nameTa: 'திருப்புவனம்' },
          { nameEn: 'Ilayangudi', nameTa: 'இளையான்குடி' },
          { nameEn: 'Tirupathur', nameTa: 'திருப்பத்தூர்' },
          { nameEn: 'Singampunari', nameTa: 'சிங்கம்புணரி' },
          { nameEn: 'Kalaiyarkovil', nameTa: 'காளையார்கோவில்' }
        ]
      },
      {
        id: 'tenkasi',
        nameEn: 'Tenkasi',
        nameTa: 'தென்காசி',
        taluks: [
          { nameEn: 'Tenkasi', nameTa: 'தென்காசி' },
          { nameEn: 'Sankarankovil', nameTa: 'சங்கரன்கோவில்' },
          { nameEn: 'Ambasamudram', nameTa: 'அம்பாசமுத்திரம்' },
          { nameEn: 'Kadayanallur', nameTa: 'கடையநல்லூர்' },
          { nameEn: 'Shenkottai', nameTa: 'செங்கோட்டை' },
          { nameEn: 'Sivagiri', nameTa: 'சிவResource' },
          { nameEn: 'Alangulam', nameTa: 'ஆலங்குளம்' },
          { nameEn: 'Veerakeralamputhur', nameTa: 'வீரகேரளம்புதூர்' },
          { nameEn: 'Thiruvengadam', nameTa: 'திருவேங்கடம்' }
        ]
      },
      {
        id: 'thanjavur',
        nameEn: 'Thanjavur',
        nameTa: 'தஞ்சாவூர்',
        taluks: [
          { nameEn: 'Thanjavur', nameTa: 'தஞ்சாவூர்' },
          { nameEn: 'Kumbakonam', nameTa: 'கும்பகோணம்' },
          { nameEn: 'Papanasam', nameTa: 'பாபநாசம்' },
          { nameEn: 'Pattukkottai', nameTa: 'பட்டுக்கோட்டை' },
          { nameEn: 'Peravurani', nameTa: 'பேராவூரணி' },
          { nameEn: 'Orathanadu', nameTa: 'ஒரத்தநாடு' },
          { nameEn: 'Thiruvaiyaru', nameTa: 'திருவையாறு' },
          { nameEn: 'Thiruvidaimarudur', nameTa: 'திருவிடைமருதூர்' },
          { nameEn: 'Budalur', nameTa: 'பூதலூர்' }
        ]
      },
      {
        id: 'theni',
        nameEn: 'Theni',
        nameTa: 'தேனி',
        taluks: [
          { nameEn: 'Theni', nameTa: 'தேனி' },
          { nameEn: 'Periyakulam', nameTa: 'பெரியகுளம்' },
          { nameEn: 'Bodinayakanur', nameTa: 'போடிநாயக்கனூர்' },
          { nameEn: 'Uthamapalayam', nameTa: 'உத்தமபாளையம்' },
          { nameEn: 'Andipatti', nameTa: 'ஆண்டிபட்டி' }
        ]
      },
      {
        id: 'thoothukudi',
        nameEn: 'Thoothukudi',
        nameTa: 'தூத்துக்குடி',
        taluks: [
          { nameEn: 'Thoothukudi', nameTa: 'தூத்துக்குடி' },
          { nameEn: 'Tiruchendur', nameTa: 'திருச்செந்தூர்' },
          { nameEn: 'Kovilpatti', nameTa: 'கோவில்பட்டி' },
          { nameEn: 'Srivaikuntam', nameTa: 'ஸ்ரீவைகுண்டம்' },
          { nameEn: 'Ottapidaram', nameTa: 'ஒட்டப்பிடாரம்' },
          { nameEn: 'Ettayapuram', nameTa: 'எட்டயபுரம்' },
          { nameEn: 'Vilathikulam', nameTa: 'விளாத்திகுளம்' },
          { nameEn: 'Sathankulam', nameTa: 'சாத்தான்குளம்' },
          { nameEn: 'Kayathar', nameTa: 'கயத்தாறு' },
          { nameEn: 'Eral', nameTa: 'ஏரல்' }
        ]
      },
      {
        id: 'tiruchirappalli',
        nameEn: 'Tiruchirappalli',
        nameTa: 'திருச்சிராப்பள்ளி',
        taluks: [
          { nameEn: 'Tiruchirappalli East', nameTa: 'திருச்சிராப்பள்ளி கிழக்கு' },
          { nameEn: 'Tiruchirappalli West', nameTa: 'திருச்சிராப்பள்ளி மேற்கு' },
          { nameEn: 'Srirangam', nameTa: 'ஸ்ரீரங்கம்' },
          { nameEn: 'Lalgudi', nameTa: 'லால்குடி' },
          { nameEn: 'Manachanallur', nameTa: 'மணச்சநல்லூர்' },
          { nameEn: 'Musiri', nameTa: 'முசிறி' },
          { nameEn: 'Thuraiyur', nameTa: 'துறையூர்' },
          { nameEn: 'Manapparai', nameTa: 'மணப்பாறை' },
          { nameEn: 'Thiruverumbur', nameTa: 'திருவெறும்பூர்' },
          { nameEn: 'Marungapuri', nameTa: 'மருங்காபுரி' },
          { nameEn: 'Thottiyam', nameTa: 'தொட்டியம்' }
        ]
      },
      {
        id: 'tirunelveli',
        nameEn: 'Tirunelveli',
        nameTa: 'திருநெல்வேலி',
        taluks: [
          { nameEn: 'Tirunelveli', nameTa: 'திருநெல்வேலி' },
          { nameEn: 'Palayamkottai', nameTa: 'பாளையங்கோட்டை' },
          { nameEn: 'Ambasamudram', nameTa: 'அம்பாசமுத்திரம்' },
          { nameEn: 'Nanguneri', nameTa: 'நாங்குநேரி' },
          { nameEn: 'Radhapuram', nameTa: 'ராதாபுரம்' },
          { nameEn: 'Cheranmahadevi', nameTa: 'சேரன்மகாதேவி' },
          { nameEn: 'Manur', nameTa: 'மானூர்' },
          { nameEn: 'Tisayanvilai', nameTa: 'திசையன்விளை' }
        ]
      },
      {
        id: 'tirupathur',
        nameEn: 'Tirupathur',
        nameTa: 'திருப்பத்தூர்',
        taluks: [
          { nameEn: 'Tirupathur', nameTa: 'திருப்பத்தூர்' },
          { nameEn: 'Vaniyambadi', nameTa: 'வாணியம்பாடி' },
          { nameEn: 'Ambur', nameTa: 'ஆம்பூர்' },
          { nameEn: 'Natrampalli', nameTa: 'நாட்ராம்பள்ளி' }
        ]
      },
      {
        id: 'tiruppur',
        nameEn: 'Tiruppur',
        nameTa: 'திருப்பூர்',
        taluks: [
          { nameEn: 'Tiruppur North', nameTa: 'திருப்பூர் வடக்கு' },
          { nameEn: 'Tiruppur South', nameTa: 'திருப்பூர் தெற்கு' },
          { nameEn: 'Avinashi', nameTa: 'அவிநாசி' },
          { nameEn: 'Palladam', nameTa: 'பல்லடம்' },
          { nameEn: 'Dharapuram', nameTa: 'தாராபுரம்' },
          { nameEn: 'Kangeyam', nameTa: 'காங்கேயம்' },
          { nameEn: 'Udumalaipettai', nameTa: 'உடுமலைப்பேட்டை' },
          { nameEn: 'Madathukulam', nameTa: 'மடத்துக்குளம்' },
          { nameEn: 'Uthukuli', nameTa: 'ஊத்துக்குளி' }
        ]
      },
      {
        id: 'tiruvallur',
        nameEn: 'Tiruvallur',
        nameTa: 'திருவள்ளூர்',
        taluks: [
          { nameEn: 'Tiruvallur', nameTa: 'திருவள்ளூர்' },
          { nameEn: 'Poonamallee', nameTa: 'பூந்தமல்லி' },
          { nameEn: 'Avadi', nameTa: 'ஆவடி' },
          { nameEn: 'Ponneri', nameTa: 'பொன்னேரி' },
          { nameEn: 'Gummidipoondi', nameTa: 'கும்மிடிப்பூண்டி' },
          { nameEn: 'Tiruttani', nameTa: 'திருத்தணி' },
          { nameEn: 'Uthukkottai', nameTa: 'ஊத்துக்கோட்டை' },
          { nameEn: 'Pallipattu', nameTa: 'பள்ளிப்பட்டு' },
          { nameEn: 'R.K. Pet', nameTa: 'ஆர்.கே. பேட்டை' }
        ]
      },
      {
        id: 'tiruvannamalai',
        nameEn: 'Tiruvannamalai',
        nameTa: 'திருவண்ணாமலை',
        taluks: [
          { nameEn: 'Tiruvannamalai', nameTa: 'திருவண்ணாமலை' },
          { nameEn: 'Arani', nameTa: 'ஆரணி' },
          { nameEn: 'Cheyyar', nameTa: 'செய்யாறு' },
          { nameEn: 'Polur', nameTa: 'போளூர்' },
          { nameEn: 'Chengam', nameTa: 'செங்கம்' },
          { nameEn: 'Vandavasi', nameTa: 'வந்தவாசி' },
          { nameEn: 'Kalasapakkam', nameTa: 'கலசப்பாக்கம்' },
          { nameEn: 'Kilpennathur', nameTa: 'கீழ்பென்னாத்தூர்' },
          { nameEn: 'Chetpet', nameTa: 'சேத்துப்பட்டு' },
          { nameEn: 'Jamunamarathur', nameTa: 'ஜமுனாமரத்தூர்' },
          { nameEn: 'Vembakkam', nameTa: 'வெம்பாக்கம்' },
          { nameEn: 'Thandarampattu', nameTa: 'தண்டராம்பட்டு' }
        ]
      },
      {
        id: 'tiruvarur',
        nameEn: 'Tiruvarur',
        nameTa: 'திருவாரூர்',
        taluks: [
          { nameEn: 'Tiruvarur', nameTa: 'திருவாரூர்' },
          { nameEn: 'Mannargudi', nameTa: 'மன்னார்குடி' },
          { nameEn: 'Thiruthuraipoondi', nameTa: 'திருத்துறைப்பூண்டி' },
          { nameEn: 'Nannilam', nameTa: 'நன்னிலம்' },
          { nameEn: 'Kudavasal', nameTa: 'குடவாசல்' },
          { nameEn: 'Valangaiman', nameTa: 'வலங்கைமான்' },
          { nameEn: 'Needamangalam', nameTa: 'நீடாமங்கலம்' },
          { nameEn: 'Koothanallur', nameTa: 'கூத்தநல்லூர்' }
        ]
      },
      {
        id: 'vellore',
        nameEn: 'Vellore',
        nameTa: 'வேலூர்',
        taluks: [
          { nameEn: 'Vellore', nameTa: 'வேலூர்' },
          { nameEn: 'Katpadi', nameTa: 'காட்பாடி' },
          { nameEn: 'Gudiyatham', nameTa: 'குடியாத்தம்' },
          { nameEn: 'Anaicut', nameTa: 'அணைக்கட்டு' },
          { nameEn: 'Pernambut', nameTa: 'பேரணாம்பட்டு' },
          { nameEn: 'K.V. Kuppam', nameTa: 'கே.வி. குப்பம்' }
        ]
      },
      {
        id: 'viluppuram',
        nameEn: 'Viluppuram',
        nameTa: 'விழுப்புரம்',
        taluks: [
          { nameEn: 'Viluppuram', nameTa: 'விழுப்புரம்' },
          { nameEn: 'Tindivanam', nameTa: 'திண்டிவனம்' },
          { nameEn: 'Gingee', nameTa: 'செஞ்சி' },
          { nameEn: 'Vanur', nameTa: 'வானூர்' },
          { nameEn: 'Vikravandi', nameTa: 'விக்கிரவாண்டி' },
          { nameEn: 'Marakkanam', nameTa: 'மரக்காணம்' },
          { nameEn: 'Kandachipuram', nameTa: 'கண்டாச்சிபுரம்' },
          { nameEn: 'Melmalayanur', nameTa: 'மேல்மலையனூர்' },
          { nameEn: 'Thiruvennainallur', nameTa: 'திருவெண்ணெய்நல்லூர்' }
        ]
      },
      {
        id: 'virudhunagar',
        nameEn: 'Virudhunagar',
        nameTa: 'விருதுநகர்',
        taluks: [
          { nameEn: 'Virudhunagar', nameTa: 'விருதுநகர்' },
          { nameEn: 'Sivakasi', nameTa: 'சிவகாசி' },
          { nameEn: 'Rajapalayam', nameTa: 'ராஜபாளையம்' },
          { nameEn: 'Srivilliputhur', nameTa: 'ஸ்ரீவில்லிபுத்தூர்' },
          { nameEn: 'Aruppukkottai', nameTa: 'அருப்புக்கோட்டை' },
          { nameEn: 'Sattur', nameTa: 'சாத்தூர்' },
          { nameEn: 'Tiruchuli', nameTa: 'திருச்சுழி' },
          { nameEn: 'Kariapatti', nameTa: 'காரியாபட்டி' },
          { nameEn: 'Vembakottai', nameTa: 'வெம்பக்கோட்டை' },
          { nameEn: 'Watrap', nameTa: 'வத்ராயிருப்பு' }
        ]
      }
    ]
  },
  {
    id: 'puducherry',
    nameEn: 'Puducherry',
    nameTa: 'புதுச்சேரி',
    districts: [
      {
        id: 'puducherry_district',
        nameEn: 'Puducherry',
        nameTa: 'புதுச்சேரி',
        taluks: [
          { nameEn: 'Puducherry', nameTa: 'புதுச்சேரி' },
          { nameEn: 'Oulgaret', nameTa: 'உழவர்கரை' },
          { nameEn: 'Villianur', nameTa: 'வில்லியனூர்' },
          { nameEn: 'Bahour', nameTa: 'பாகூர்' }
        ]
      },
      {
        id: 'karaikal',
        nameEn: 'Karaikal',
        nameTa: 'காரைக்கால்',
        taluks: [
          { nameEn: 'Karaikal', nameTa: 'காரைக்கால்' },
          { nameEn: 'Thirunallar', nameTa: 'திருநள்ளாறு' },
          { nameEn: 'Nedungadu', nameTa: 'நெடுங்காடு' },
          { nameEn: 'Kottucherry', nameTa: 'கோட்டுச்சேரி' },
          { nameEn: 'Neravy', nameTa: 'நிரவி' },
          { nameEn: 'T.R. Pattinam', nameTa: 'தி.ரா. பட்டினம்' }
        ]
      },
      {
        id: 'mahe',
        nameEn: 'Mahe',
        nameTa: 'மாகே',
        taluks: [
          { nameEn: 'Mahe', nameTa: 'மாகே' }
        ]
      },
      {
        id: 'yanam',
        nameEn: 'Yanam',
        nameTa: 'ஏனாம்',
        taluks: [
          { nameEn: 'Yanam', nameTa: 'ஏனாம்' }
        ]
      }
    ]
  }
];

export function getDistrictsForState(stateName: string) {
  const state = LOCATION_MASTER_DATA.find(
    s => s.nameEn.toLowerCase() === stateName.toLowerCase() || s.nameTa === stateName
  );
  return state ? state.districts : [];
}

export function getTaluksForDistrict(stateName: string, districtName: string) {
  const districts = getDistrictsForState(stateName);
  const district = districts.find(
    d => d.nameEn.toLowerCase() === districtName.toLowerCase() || d.nameTa === districtName
  );
  return district ? district.taluks : [];
}
