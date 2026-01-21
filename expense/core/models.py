from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50, unique=True)

class Group(models.Model):
    name = models.CharField(max_length=50, unique=True)
    users = models.ManyToManyField(User)

class Expense(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    paid_by = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()
    split_type = models.CharField(max_length=10)

class Balance(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    frm = models.ForeignKey(User, on_delete=models.CASCADE, related_name='frm')
    to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='to')
    amount = models.FloatField()

    class Meta:
        unique_together = ('group', 'frm', 'to')
