head (vox.headlines)
library (stringr)

voxheadlines9july$datetime = gsub('([\n][ ]*[-A-Za-z\u00C0-\u017F". ]*[\n])(.*)','\\2', 
  voxheadlines9july$adate)
voxheadlines9july$datetimenew = gsub('([\n][ ]*[-A-Za-z\u00C0-\u017F"-". ]*, updated[\n])(.*)','\\2', 
  voxheadlines9july$datetime)
voxheadlines9july$datetimenew = gsub('([\n][ ]*[-A-Za-z\u00C0-\u017F"-"., ]*
  [", and "][-A-Za-z\u00C0-\u017F"-". ]*[\n])(.*)','\\2', voxheadlines9july$datetimenew)
voxheadlines9july$datetimenewnew = gsub('([\n][ ]*[-A-Za-z\u00C0-\u017F"-"., ]*
  [", and"]*[-A-Za-z\u00C0-\u017F"-". ]*[,][ updated]*[\n])(.*)','\\2', voxheadlines9july$datetimenew)
View (voxheadlines9july)

voxheadlines9july$datetimefinal = voxheadlines9july$datetimenewnew
voxheadlines9july$datetimenew = voxheadlines9july$datetimenewnew = NULL

head (voxheadlines9july)
voxheadlines9july$datetimefinal
voxheadlines9july$datetimeclean = 
  gsub('[ ]*([A-Za-z0-9:., ]* ET)(.*)(.*)','\\1', voxheadlines9july$datetimefinal)
voxheadlines9july$monthname = 
  gsub('^([A-Za-z]*) ([0-9]*), ([0-9][0-9][0-9][0-9]), ([0-9 :.amp]*) ET$',
        '\\1', voxheadlines9july$datetimeclean)
voxheadlines9july$date = 
  gsub('^([A-Za-z]*) ([0-9]*), ([0-9][0-9][0-9][0-9]), ([0-9 :.amp]*) ET$',
       '\\2', voxheadlines9july$datetimeclean)
voxheadlines9july$year = 
  gsub('^([A-Za-z]*) ([0-9]*), ([0-9][0-9][0-9][0-9]), ([0-9 :.amp]*) ET$',
       '\\3', voxheadlines9july$datetimeclean)
voxheadlines9july$time = 
  gsub('^([A-Za-z]*) ([0-9]*), ([0-9][0-9][0-9][0-9]), ([0-9 :.amp]*) ET$',
       '\\4', voxheadlines9july$datetimeclean)

head(voxheadlines9july)
names (months) = c('month','monthnumber')
dataset = merge(x = voxheadlines9july, y = months, by.x = "monthname", by.y = "month")
head(dataset)
voxheadlines9july$monthname
months$monthname

nrow(voxheadlines9july[voxheadlines9july$datetime=="",])
problemset = voxheadlines9july[voxheadlines9july$datetime=="",]
View (problemset)

#looks like the problem set is just empty spaces. all good.

head(dataset)
library (lubridate)
library (stringr)
dataset$year = str_trim(dataset$year)
dataset$monthnumber = str_trim(dataset$monthnumber)
dataset$datecombined = paste (dataset$year,'-',dataset$monthnumber,'-',dataset$date,sep="")
head (dataset$datecombined)
str_length (dataset$datecombined[1])
datasetcopy = dataset

cleanmonth = function (x){
  if (str_length (x==1)){
    x = paste(0,x,sep="")
  }
}

sent_token_annotator <- Maxent_Sent_Token_Annotator()
word_token_annotator <- Maxent_Word_Token_Annotator()
pos_tag_annotator <- Maxent_POS_Tag_Annotator()

entity_annotator <- Maxent_Entity_Annotator()
entity_annotator

(language = "en", kind = "person", probs = FALSE, model = 'en-ner-person.bin')

a3 <- annotate(dataset$headline,
               list(sent_token_annotator,
                    word_token_annotator,
                    pos_tag_annotator))

a2 <- annotate(dataset$headline, list(sent_token_annotator, word_token_annotator))

types <- entity_annotator(dataset$headline, a2)
ty <- data.frame (types)
View(ty)

# new code for nlp
library(NLP)
library(openNLP)
library(magrittr)

word_ann <- Maxent_Word_Token_Annotator()
sent_ann <- Maxent_Sent_Token_Annotator()
bio_annotations <- annotate(dataset$headline, list(sent_ann, word_ann))
bio_annotations

person_ann <- Maxent_Entity_Annotator(kind = "person")

pipeline <- list(sent_ann,
                 word_ann,
                 person_ann
                 )
bio_annotations <- annotate(dataset$headline, pipeline)
bio_doc <- AnnotatedPlainTextDocument(dataset$headline, bio_annotations)
bio_doc
head (bio_doc)

# back to cleaning time stamps

library (lubridate)
datasetcopy$monthnumber
dataset = datasetcopy


exportJson <- toJSON(dataset)
write(exportJson, "dataset.json")

