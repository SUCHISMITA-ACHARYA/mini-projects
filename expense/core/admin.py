from django.contrib import admin
from django.contrib.auth.models import User as AuthUser
from .models import User, Group, Expense, Balance

admin.site.unregister(AuthUser)

admin.site.register(User)
admin.site.register(Group)
admin.site.register(Expense)
admin.site.register(Balance)
