
import sys
from nsfw_model.nsfw_detector.predict import classify_nd, load_model,load_images
import config
from google.cloud import storage
import cv2
import numpy as np
import os
import json
def init():
    '''
    load the pretrained model, download the video we need to process, make the tmp folder to hold the video/images
    '''
    os.makedirs(config.FRAMES_FOLDER,exist_ok=True)
    #load the model with the weights file
    model= load_model(config.MODEL_PATH)
    #create the google storage client
    storage_client = storage.Client("hackathon-vanilla-custard")
    bucket=storage_client.get_bucket('vanilla-custard-bucket')
    blob=bucket.blob("nsfw_collection.mp4")
    blob.download_to_filename(config.INPUT_VIDEO)
    
    return model,bucket

def get_stills(interval):
    '''
    convert video to a bunch of stills <interval> seconds apart
    '''
    captureObj=cv2.VideoCapture(config.INPUT_VIDEO)
    ret=True
    frames_limit=int(captureObj.get(cv2.CAP_PROP_FPS)*interval)
     #!REMOVE!
    frame_ctr=0
    i=0
    while ret:
        ret, img = captureObj.read()
        if ret:
            if frame_ctr%frames_limit==0:
                fpath=os.path.join(config.FRAMES_FOLDER,'frame_{}.jpg'.format(i))
                cv2.imwrite(fpath,img)
                i+=1
                frame_ctr+=1
            else:
                frame_ctr+=1
    print("Generated Frames!")

    
    

def get_preds(model, imagearray, imgnames):
    probs = classify_nd(model,imagearray)
    results=[]
    frameNos=[]
    for imgpath,probDict in zip(imgnames,probs):
        relevantClassesProb={}
        frame=imgpath.split("/")[-1].split(".")[0].split("_")[-1]
        for ix,classname in enumerate(config.originalCategories):
            relevantClassesProb[config.categories[ix]]=probDict[classname]
        frameNos.append(frame)
        results.append(relevantClassesProb)
    return dict(zip(frameNos,results))

def parse_predictions(resDict):
    
    frameList=list(resDict.keys())
    frameList=[int(f) for f in frameList]
    frameList.sort()
    frameList=[str(f) for f in frameList]
    flagList=[]
    flagCount=1
    flagClass=""
    firstFrameFound=False
    startFrame,endFrame=-1,-1
    for frame in frameList:

        frameDict=resDict.get(frame)
        maxThreshold=0
        frameCategory=''
        for category in config.categories:
            if frameDict[category]>maxThreshold:
                maxThreshold=frameDict[category]
                frameCategory=category


        
        if maxThreshold>config.predictionThreshold and firstFrameFound==False and frameCategory in config.troubleCategories:#found our category, go to next frame
            flagClass=frameCategory
            startFrame=int(frame)
            firstFrameFound=True
            
        elif firstFrameFound and flagClass==frameCategory: #we have more than one frame flagged ,continue ...
            endFrame=int(frame)
            
        elif firstFrameFound and flagClass!=frameCategory and endFrame==-1: # only one frame is troublesome, mostly a false positive, drop and start again
            firstFrameFound=False
            flagClass=""
            startFrame=endFrame=-1
            
        elif frameCategory!=flagClass and endFrame!=-1 and firstFrameFound: # we have more than one frame as our range, and we have now arrived at the end
            flagDict={}
            flagDict['_id']=str(flagCount)
            flagDict['nsfw_type']=flagClass
            flagDict['startTime']=int(config.INTERVAL*startFrame)
            flagDict['endTime']=int(config.INTERVAL*endFrame)
            flagDict['startFrame']=startFrame
            flagDict['endFrame']=endFrame
            flagList.append(flagDict)
            firstFrameFound=False
            flagClass=""
            startFrame=endFrame=-1
            flagCount+=1
    return flagList

def process_video(interval,model):
    get_stills(interval)
    imageArray,imgNames=load_images(config.FRAMES_FOLDER,(config.IMG_DIM,config.IMG_DIM),verbose=False)
    resDict=get_preds(model,imageArray,imgNames)
    flagList=parse_predictions(resDict)
    resList = sorted(flagList, key=lambda k: k['startTime'])
    return resList

def upload_res(bucket):
    blob = bucket.blob(config.RESULT_JSON.split("/")[-1])
    blob.upload_from_filename(config.RESULT_JSON)

def main():
    model,bucket=init()
    flagList=process_video(config.INTERVAL,model)
    upload_res(bucket)
    
    with open(config.RESULT_JSON,'w') as fout:
        json.dump(flagList, fout)
    


if __name__=="__main__":
    main()







