from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('update/<int:pk>', views.update, name='update'),
    path('remove/<int:pk>', views.remove, name='remove'),
]
