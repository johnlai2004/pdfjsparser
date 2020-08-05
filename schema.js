const DELIMITER = "|";

// Use COLUMNS to denote which columns you wish to print to a CSV file.  These columns will be printed in order top down
const COLUMNS = {
  "Service Number":"Service Number",
  "Age":"Age",
  "Group17":"Gender",
  "Rank":"Rank",
  "Trade":"Trade",
  "Group18":"Working Status",
  "Group19":"Medical Category",
  "Group20":"NPS1 Average Pain 7 days",
  "Group21":"NPS2 Worse Pain 7 days",
  "Group22":"NPS3 Least Pain 7 days",
  "Group23":"PDI1 Family Home Resp",
  "Group24":"PDI2 Recreation",
  "Group25":"PDI3 Social Activities",
  "Group26":"PDI4 Occupation",
  "Group27":"PDI5 Sexual Behaviour",
  "Group28":"PDI6 Self-care",
  "Group29":"PDI7 Life-Support Activities",
  "Group3":"ACE1 Verbal",
  "Group4":"ACE2 Physical",
  "Group5":"ACE3 Sexual",
  "Group6":"ACE4 Love",
  "Group7":"ACE5 Necessities",
  "Group8":"ACE6 Divorce",
  "Group9":"ACE7 Treatment of Mother",
  "Group10":"ACE8 Family Drugs",
  "Group11":"ACE9 Family Mental Disorders",
  "Group12":"ACE10 Family Prison",
  "Group30":"IEQ1 Most people don't understand how severe my condition is",
  "Group31":"IEQ2 My life will never be the same",
  "Group32":"IEQ3 I am suffering because of someone else's negligence",
  "Group33":"IEQ4 No one should have to live this",
  "Group34":"IEQ5 I just want to have my life back",
  "Group35":"IEQ6 I feel that this has affected me in a permanent way",
  "Group36":"IEQ7 It all seems so unfair",
  "Group37":"IEQ8 I worry that my condition is not being taken seriously",
  "Group38":"IEQ9 Nothing will ever make up for all that I have gone through",
  "Group39":"IEQ10 I feel as if I have been robbed of something very precious",
  "Group40":"IEQ11 I am troubled by fears that I may never achieve my dreams",
  "Group41":"IEQ12 I can't believe that this has happened to me",
  "Group42":"MLQ1 I understand my life's meaning",
  "Group43":"MLQ2 I am looking for something that makes my life feel meaningful",
  "Group44":"MLQ3 I am always looking to find my life's purpose",
  "Group45":"MLQ4 My life has a clear sense of purpose",
  "Group46":"MLQ5 I have a good sense of what makes my life meaningful",
  "Group47":"MLQ6 I have discovered a satisfying life purpose",
  "Group48":"MLQ7 I am always searching for something that makes my life feel significant",
  "Group49":"MLQ8 I am seeking a purpose or mission for my life",
  "Group50":"MLQ9 My life has no clear purpose",

  "days per week":"IPA1 days per week",
  "Check Box13":"IPA1 No vigorous physical activities",

  "hours per day":"IPA2 hours per day",
  "minutes per day":"IPA2 minutes per day",
  "Check Box14":"IPA2 Don't know/Not sure",

  "days per week_2":"IPA3 days per week",
  "Check Box15":"IPA3 Don't know/Not sure",

  "hours per day_2":"IPA4 hours per day",
  "minutes per day_2":"IPA4 minutes per day",
  "Check Box16":"IPA4 Don't know/Not sure",

  "days per week_3":"IPA5 days per week",
  "Check Box17":"IPA5 No walking",
  "Check Box18":"IPA5 Skip to question 7",

  "hours per day_3":"IPA6 hours per day",
  "minutes per day_3":"IPA6 minutes per day",
  "Check Box19":"IPA6 Don't know/Not sure",

  "hours per day_4":"IPA7 hours per day",
  "minutes per day_4":"IPA7 minutes per day",
  "Check Box20":"IPA7 Don't know/Not sure",

  "Group51":"MLQ10 I am searching for the meaning in my life",
  "Group59":"Type of Visit",

  "Region 1":"Pain Region 1",
  "Region 2":"Pain Region 2",
  "Region 3":"Pain Region 3",
  "Region 4":"Pain Region 4",
  "Region 5":"Pain Region 5",
  "Region 6":"Pain Region 6",
  "Other":"Pain Region Other",
  // __concat__pain_regions is not a REAL field in the pdf document.  Instead, the prefix __concat__
  // is a COMMAND to concatenate several fields together into one string.  The list of fields to be concatenated
  // is defined in TRANSLATIONS['__concat__pain_regions']
  "__concat__pain_regions":"Pain Regions(s) - Code",

  "Diagnosis 1":"Pain Diagnosis 1",
  "Diagnosis 2":"Pain Diagnosis 2",
  "Diagnosis 3":"Pain Diagnosis 3",
  "Diagnosis 4":"Pain Diagnosis 4",
  "Diagnosis 5":"Pain Diagnosis 5",
  "Diagnosis 6":"Pain Diagnosis 6",
  "Other_2":"Pain Diagnosis Other",
  "__concat__pain_diagnosis":"Pain Diagnosis(s) - Code",


  "Diagnosis 1_2":"Mental Health Diagnosis 1",
  "Diagnosis 2_2":"Mental Health Diagnosis 2",
  "Diagnosis 3_2":"Mental Health Diagnosis 3",
  "Diagnosis 4_2":"Mental Health Diagnosis 4",
  "Diagnosis 5_2":"Mental Health Diagnosis 5",
  "Diagnosis 6_2":"Mental Health Diagnosis 6",
  "Other_3":"Mental Health Diagnosis Other",
  "__concat__mental_health_diagnosis":"Mental Health Diagnosis(s) - Code"
};
const YESNO = {"0":"Yes","1":"No"};
const NOYES = {"0":"No","1":"Yes"};
const MLQCORRECTION1 = {"0":"1","1":"2","2":"3","3":"4","4":"5","5":"6","6":"7"};
const MLQCORRECTION2 = {"0":"2","1":"3","2":"4","3":"5","4":"6","5":"7","6":"1"};

// Use TRANSLATIONS to translate numerical values to more meaningful answers for humans to read
const TRANSLATIONS = {
  "Group17":{"0":"M","1":"F","2":"O"},
  "Group18":{"0":"Off","1":"Part time","2":"Full time, modified duties","3":"Full time, no restrictions"},
  "Group19":{"0":"None","1":"TCAT","2":"PCAT"},
  "Group3":YESNO,
  "Group4":NOYES, // looks like person who made a form didn't pay attention and swapped 0 and 1 for no and yes
  "Group5":YESNO,
  "Group6":YESNO,
  "Group7":YESNO,
  "Group8":YESNO,
  "Group9":YESNO,
  "Group10":YESNO,
  "Group11":YESNO,
  "Group12":YESNO,
  "Group42":MLQCORRECTION1,
  "Group43":MLQCORRECTION1,
  "Group44":MLQCORRECTION1,
  "Group45":MLQCORRECTION1,
  "Group46":MLQCORRECTION1,
  "Group47":MLQCORRECTION1,
  "Group48":MLQCORRECTION2,
  "Group49":MLQCORRECTION2,
  "Group50":MLQCORRECTION2,
  "Group51":MLQCORRECTION2,
  "Group59":{"0":"Consult","1":"Follow up"},
  "__concat__pain_regions":["Region 1","Region 2","Region 3","Region 4","Region 5","Region 6","Other"],
  "__concat__pain_diagnosis":["Diagnosis 1","Diagnosis 2","Diagnosis 3","Diagnosis 4","Diagnosis 5","Diagnosis 6","Other_2"],
  "__concat__mental_health_diagnosis":["Diagnosis 1_2","Diagnosis 2_2","Diagnosis 3_2","Diagnosis 4_2","Diagnosis 5_2","Diagnosis 6_2","Other_3"]
};
