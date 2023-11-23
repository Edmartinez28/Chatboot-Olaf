from django.urls import path
from . import views

urlpatterns = [
    path("", views.chatboot, name="index"),
    path("principal", views.chatboot, name="principal"),
    path('generar_respuesta/<str:input_text>/', views.generarRespuesta, name='generar_respuesta'),
    ]