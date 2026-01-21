from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from .models import User, Group, Expense, Balance
from .utils import add


def index(req):
    return render(req, 'index.html')


@csrf_exempt
@api_view(['POST'])
def group(req):
    gname = req.data.get('group')
    members = req.data.get('members', [])

    if not gname or not members:
        return Response({'ok': False})

    g, _ = Group.objects.get_or_create(name=gname)

    users = []
    for name in members:
        u, _ = User.objects.get_or_create(name=name)
        users.append(u)

    g.users.set(users)
    return Response({'ok': True})


@csrf_exempt
@api_view(['POST'])
def expense(req):
    gname = req.data.get('group')
    paid_name = req.data.get('paid_by')
    amount = req.data.get('amount')
    kind = req.data.get('type')
    splits = req.data.get('splits', [])

    g = Group.objects.filter(name=gname).first()
    paid = User.objects.filter(name=paid_name).first()

    if not g or not paid or not amount or not kind:
        return Response({'ok': False})

    amount = float(amount)

    Expense.objects.create(
        group=g,
        paid_by=paid,
        amount=amount,
        split_type=kind
    )

    users = list(g.users.all())

    if kind == 'EQUAL':
        share = amount / len(users)
        for u in users:
            if u != paid:
                add(g, u, paid, share)

    elif kind == 'EXACT':
        for s in splits:
            u = User.objects.filter(name=s.get('name')).first()
            if u:
                add(g, u, paid, float(s.get('amount', 0)))

    elif kind == 'PERCENT':
        for s in splits:
            u = User.objects.filter(name=s.get('name')).first()
            if u:
                part = (float(s.get('percent', 0)) * amount) / 100
                add(g, u, paid, part)

    return Response({'ok': True})


@api_view(['GET'])
def balances(req, group, user):
    g = Group.objects.filter(name=group).first()
    u = User.objects.filter(name=user).first()

    if not g or not u:
        return Response({'owe': [], 'owed': []})

    owe = []
    owed = []

    for b in Balance.objects.filter(group=g, frm=u):
        owe.append({
            'name': b.to.name,
            'amount': b.amount
        })

    for b in Balance.objects.filter(group=g, to=u):
        owed.append({
            'name': b.frm.name,
            'amount': b.amount
        })

    return Response({'owe': owe, 'owed': owed})


@csrf_exempt
@api_view(['POST'])
def reset(req):
    Balance.objects.all().delete()
    Expense.objects.all().delete()
    Group.objects.all().delete()
    User.objects.all().delete()
    return Response({'ok': True})
