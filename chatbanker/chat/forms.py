from django import forms

class ModeloPDF(forms.Form):
    file = forms.FileField()