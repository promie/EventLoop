#!/usr/bin/env python
# coding: utf-8
import pandas as pd
from sklearn.model_selection import train_test_split as tts
from sklearn import svm
from sklearn import metrics
from sklearn.model_selection import train_test_split
import numpy as np
from sys import argv
import pickle

def SVM(a):
    data = pd.read_csv(str(a))
    interest = dict(zip(data["Interest"].tolist(), range(len(data["Interest"].tolist()))))
    #Cate = dict(zip(set(data["Category"].tolist()),range(0,10)))
    x = {"Corporate":1 ,"Fundraising" : 2 ,"Conferences and Workshops": 3 ,"Virtual": 4 , "Fandom" : 5  , "Festivals and Fairs" : 6 ,"Food and Drink" : 7 ,
    "Networking" :8 ,"Hackathons" : 9  ,"Sports and Tournaments" : 10 }
    data["interest"] = data["Interest"].map(interest)
    data["category"] = data["Category"].map(x)
    X_train = data.drop(["category","Category","Interest"],axis=1)
    y_train = data["category"]
    cls = svm.SVC(kernel='rbf',class_weight='balanced', C=1.0, random_state=0)
    cls.fit(X_train, y_train)
    # save the model to disk
    filename = 'SVM_model.sav'
    pickle.dump(cls, open(filename, 'wb'))
    
  
SVM("data_re.csv")





