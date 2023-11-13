from fastapi import FastAPI, HTTPException, Body, Request, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
import openai
import wikipedia
import chromadb
import random
from chromadb.utils import embedding_functions
from io import BytesIO
from PIL import Image
import tensorflow as tf

chroma_client = chromadb.Client()
emb_fn = embedding_functions.OpenAIEmbeddingFunction(
        api_key="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",
        model_name="text-embedding-ada-002"
    )

openai.api_key = "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"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_message_info(messages):
    content_list = []
    role_dict = {}
    content_count = []

    for message in messages:
        role = message.get("role", "user")
        content = message.get("content", "")

        # Append the content to the content_list
        content_list.append(content)

        # Update the role_dict with the role and content
        if role not in role_dict:
            role_dict[role] = []
        role_dict[role].append(content)

    # Count the number of each unique content
    unique_content = list(set(content_list))
    for content in unique_content:
        count = content_list.count(content)
        content_count.append(count)

    return content_list, role_dict, content_count

def process_image(image_data):
    # Convert base64 data to bytes
    image_bytes = BytesIO(image_data)

    image_tensor = tf.image.decode_image(image_bytes.getvalue(), channels=3)
    image_tensor = tf.image.resize(image_tensor, [256, 256])  # Resize the image if needed
    image_tensor = tf.expand_dims(image_tensor, 0)  # Add batch dimension
    
    # Perform your image processing or classification logic here
    # For demonstration purposes, this example assumes a mock classification.
    labels = ["Label1", "Label2", "Label3"]

    return labels

class ImageClassificationResponse(BaseModel):
    label1: str
    label2: str
    label3: str
    
@app.post("/classify")
async def classify_image(file: UploadFile):
    try:
        # Read the content of the uploaded file
        content = await file.read()

        # Process the image content
        labels = process_image(content)

        # Return the top 3 labels as a response
        response = ImageClassificationResponse(
            label1=labels[0],
            label2=labels[1],
            label3=labels[2]
        )

        return JSONResponse(content=response.dict())

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/initChat")
async def initChat(request: Request):
    req = await request.json()

    #store wikipedia article in chromadb to make vector search
    result = wikipedia.search(req["argument"], results=1)
    try:
        page_object = wikipedia.page(result[0], auto_suggest=False, redirect=True, preload=False)
    except wikipedia.DisambiguationError as e:
        s = random.choice(e.options)
        page_object = wikipedia.page(s)
        
    # Split the article into paragraphs
    articles = page_object.content.split('\n\n')

    replace_chars = [" ", ",", ".."]

    #make the title of the collection camplacent with chromadb indications
    text = req["argument"]
    for char in replace_chars:
        text = text.replace(char, "")

    #create the collection for the articles
    collection = chroma_client.get_or_create_collection("a"+text+"z", embedding_function=emb_fn)

    collection.add(
        documents=articles,
        ids= [str(i) for i in range(1, len(articles) + 1)]
    )

    results = collection.query(
        query_texts=["What is "+req["argument"]],
        n_results=2
    )

    # Add a system message to the messages list
    messages = [
        {
            "role": "system",
            "content": f"knowledge 1: {results['documents'][0][0]}"
        },
        {
            "role": "system",
            "content": f"knowledge 2: {results['documents'][0][1]}"
        },        
        {
            "role": "system",
            "content": f"explain what you know to the user in less than 100 words, start like this 'Hi, [argument] are something'"
        }
    ]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
    )

    collection.add(
        documents=articles,
        ids= [str(i) for i in range(1, len(articles) + 1)]
    )

    #create collection for user and assistant messages

    # Create the collection
    print("\n\n\n\n\n\n"+str(req)+"\n\n\n\n\n\n\n")
    try: 
        chroma_client.delete_collection(name=req["uiid"])
        chat = chroma_client.create_collection(name=req["uiid"], embedding_function=emb_fn)
    except:
        chat = chroma_client.create_collection(name=req["uiid"], embedding_function=emb_fn)

    res = response['choices'][0]['message']['content']

    chat.add(
        documents=[res],
        metadatas=[{"role":"assistant"}],
        ids=["0"]
    )

    chatresults = chat.query(
        query_texts=[req["argument"]],
        n_results=3
    )

    print(chatresults)

    return JSONResponse(content={"result": res})

# Your API endpoint
@app.post("/chat")
async def chat(request: Request):
    req = await request.json()
    messages = []


    replace_chars = [" ", ",", ".."]

    text = req["argument"]
    for char in replace_chars:
        text = text.replace(char, "")
        
    #get the articles that are important in thiss context
    collection = chroma_client.get_collection("a"+text+"z", embedding_function=emb_fn)
    results = collection.query(
        query_texts=[req["userMessage"]["content"], req["argument"]],
        n_results=3
    )

    messages.insert(0, 
    {
        "role": "system",
        "content": "You are a guide write short messages maximum 80 words"
    })

    # Add a system message to the messages list
    messages.insert(0, 
    {
        "role": "system",
        "content": f"database informations: {results['documents'][0][0]}.\n{results['documents'][0][1]}.\n{results['documents'][0][2]}"
    }),

    #get the previous chat messages that are relevant to the current chat
    chat = chroma_client.get_collection(req["uiid"], embedding_function=emb_fn)
    chatresults = chat.query(
        query_texts=[req["userMessage"]["content"], req["argument"]],
        n_results=3
    )
    
    
    for result in range(len(chatresults['documents'][0])):
        messages.append({
            "role": chatresults['metadatas'][0][result]["role"],
            "content": chatresults['documents'][0][result]
        })
        
    messages.append(req["userMessage"])
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    
    res = response['choices'][0]['message']['content']
    
    chat.add(        
        documents=[res, req["userMessage"]["content"]],
        metadatas=[{"role":"assistant"}, {"role":req["userMessage"]["role"]}],
        ids=["1", "2"]
    )

    return JSONResponse(content=res)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)