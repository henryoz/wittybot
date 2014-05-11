#!/usr/bin/python
# -*- coding: utf-8 -*-

import twitter
import requests
import json


def main():

    api = twitter.Api(consumer_key='',
                      consumer_secret='',
                      access_token_key=''
                      ,
                      access_token_secret='')

    getNounsURL = 'http://api.wordnik.com/v4/words.json/randomWords?' \
        + 'minCorpusCount=1000&minDictionaryCount=10&' \
        + 'excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&' \
        + 'hasDictionaryDef=true&includePartOfSpeech=noun&limit=2&maxLength=12&' \
        + 'api_key=fbf1963c205cb0fd3c007018a4106fbdfefc34f2ac581a165'

    r = requests.get(getNounsURL)
    words = json.loads(r.text)
    tweet = 'The limits of my %s mean the limits of my %s.' % (words[0]['word'],
            words[1]['word'])

    return tweet
    r = api.PostUpdate(tweet)
    print json.loads(r)


if __name__ == '__main__':
    main()
