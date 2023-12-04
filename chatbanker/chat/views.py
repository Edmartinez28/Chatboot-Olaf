from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from chat.forms import ModeloPDF
from django.conf import settings
from scipy.spatial import distance
from sklearn.cluster import KMeans

import pandas as pd
import numpy as np
import ast
import os
import time
import openai
import PyPDF2
import spacy
from sklearn.metrics.pairwise import cosine_similarity

def actualizarEmbeddings():
    for e in embeddings['embedding']:
        listaEmbeddings.append(e.strip('][').split(', '))



embeddings = pd.read_csv("/home/edmartinez/Documents/UTPL/Septimo Ciclo/Inteligencia Artificial/ChatbootGUI/chatbanker/embeddings.csv")
nlp = spacy.load('es_core_news_sm')

listaEmbeddings = []
actualizarEmbeddings()

def index(request):
    return HttpResponse("Hello, world. You're at the chat index.")

def chatboot(request):

    return render(request , 'principal.html')

def get_embedding(text, model="text-embedding-ada-002"):
   text = text.replace("\n", " ")
   #time.sleep(20)
   print("Embedding generado")
   return client.embeddings.create(input = [text], model=model).data[0].embedding

@api_view(['GET'])
@csrf_exempt
def generarRespuesta(request, input_text):
    input_text = input_text.replace("\n", " ")
    input_embedding = client.embeddings.create(input = [input_text],  model="text-embedding-ada-002").data[0].embedding

    busqueda = encontrarSimilitud(input_embedding , input_text)
    data = {}
    data['mensaje'] = busqueda['entrada']
    data['referencia'] = busqueda['referencia']
    return JsonResponse(data)

def encontrarSimilitud(input_embedding , input_text):
    input_embedding_array = np.array(input_embedding)

    similarities = cosine_similarity(input_embedding_array.reshape(1, -1), listaEmbeddings)
    most_similar_index = similarities.argmax()
    salida2 = embeddings.iloc[most_similar_index : most_similar_index+3]
    print(type(salida2))
    '''
    #Obtener los índices de las N mayores similitudes
    most_similar_indices = np.argpartition(similarities, -3)[-3:]
    most_similar_indices = most_similar_indices.flatten()
    salida3 = embeddings.iloc[most_similar_indices]
    print(type(salida3))
    #salida = embeddings.iloc[most_similar_index]
    #salida['entrada'] = salida['entrada'].replace("\n", " ")

    resultado = pd.concat([salida2, salida3], ignore_index=True)'''
    resultado = salida2
    for r in resultado:
        resultado['entrada'] = resultado['entrada'].replace("\n", " ")

    contexto = ""
    referencia = embeddings.iloc[most_similar_index]['referencia']

    for e in resultado['entrada']:
        contexto += e

    print(contexto)
    print("=============================================================")

    response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        #{"role": "system", "content": "Eres una asistente útil."},
        #{"role": "user", "content": "Responda la pregunta con la mayor sinceridad posible utilizando el contexto proporcionado y, si la respuesta no está contenida en el texto siguiente, diga Lo siento no pude encontrar una respuesta"},
        {"role": "system", "content": "Eres un asistente basado en Inteligencia Artificial (Te llamas Fred) capaz de mantener una conversación en tiempo real por texto, que ayudará a resolver dudas sobre los temas que te daremos."},
        {"role": "user", "content": "Responde las preguntas basado en la información que encontraras en el contenido textual entregado. Si por algún motivo la respuesta ni se encuentra dentro de este contenido puedes responder: Lo siento no pude encontrar una respuesta"},
        {"role": "assistant", "content": "Contexto:"+contexto},
        {"role": "user", "content": "Segun el contexto respondeme a lo siguiente"+input_text}
    ]
    )

    mensajeGenerado = response.choices[0].message.content
    print(mensajeGenerado)
    
    resultado= {'entrada': mensajeGenerado, 'referencia': referencia}

    return resultado

def extraer_ideas_principales(ruta_pdf):
    with open(ruta_pdf, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ''
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()

    # Procesamiento de lenguaje natural con spaCy
    doc = nlp(text)

    # Extraer ideas principales 
    ideas_principales = [sent.text for sent in doc.sents]

    return ideas_principales

def generarEmbeddings(datos):
    datos["embedding"] = datos["entrada"].astype(str).apply(get_embedding) #Se crean las incrustaciones en el dataframe
    datos.to_csv('embeddings.csv', mode='a', header=False, index=False)
    print("Se generaron los embedings")
    actualizarEmbeddings()


def cargar_pdf(request):

    if request.method == 'POST':
        archivo = request.FILES['entrada']

        ruta_destino = os.path.join(settings.MEDIA_ROOT, archivo.name)
        print(ruta_destino)

        with open(ruta_destino, 'wb') as destino:
            for parte in archivo.chunks():
                destino.write(parte)
        
        ideas = extraer_ideas_principales(ruta_destino)
           
        df = pd.DataFrame(ideas)
        df["referencia"] = archivo.name
        df.rename(columns={0: 'entrada'}, inplace=True)
        df.reset_index(drop=True, inplace=True)
        df = df[df['entrada'] != '\n']

        print("El numero de ideas extraidas es de:",len(ideas))

        generarEmbeddings(df)
        actualizarEmbeddings()

    else:
        form = ModeloPDF()
        print("Fallo")

    return render(request , 'principal.html')
