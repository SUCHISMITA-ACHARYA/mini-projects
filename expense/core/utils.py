from .models import Balance

def add(group, frm, to, amount):
    if frm == to or amount <= 0:
        return

    obj, created = Balance.objects.get_or_create(
        group=group,
        frm=frm,
        to=to,
        defaults={'amount': amount}
    )

    if not created:
        obj.amount += amount
        obj.save()
