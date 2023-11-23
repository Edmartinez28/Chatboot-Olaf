from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

import pandas as pd
import numpy as np
import ast
import openai
from sklearn.metrics.pairwise import cosine_similarity

client = openai.OpenAI(api_key='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')
embeddings = pd.read_csv("/home/edmartinez/Documents/UTPL/Septimo Ciclo/Inteligencia Artificial/ChatbootGUI/chatbanker/chat/static/data/embeddingd.csv")

listaEmbeddings = []
for e in embeddings['embedding']:
    listaEmbeddings.append(e.strip('][').split(', '))


def index(request):
    return HttpResponse("Hello, world. You're at the chat index.")

def chatboot(request):

    return render(request , 'principal.html')

@api_view(['GET'])
@csrf_exempt
def generarRespuesta(request, input_text):
    input_text = input_text.replace("\n", " ")
    input_embedding = client.embeddings.create(input = [input_text],  model="text-embedding-ada-002").data[0].embedding

    data = {}
    data['mensaje'] = encontrarSimilitud(input_embedding)
    print(data)
    return JsonResponse(data)

def encontrarSimilitud(input_embedding):
    input_embedding_array = np.array(input_embedding)

    similarities = cosine_similarity(input_embedding_array.reshape(1, -1), listaEmbeddings)
    most_similar_index = similarities.argmax()

    salida = embeddings.iloc[most_similar_index]['entrada']
    salida = salida.replace("\n", " ")

    return salida