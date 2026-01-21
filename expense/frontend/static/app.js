function createGroup() {
  let g = gname.value.trim()
  let m = members.value.split(',').map(x => x.trim())

  fetch('/api/group', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group: g, members: m })
  }).then(() => {
    gmsg.innerText = "Group created: " + g + " (" + m.join(', ') + ")"
    gname.value = ""
    members.value = ""
  })
}


function toggleSplitBox() {
  splitBox.style.display = etype.value === "EQUAL" ? "none" : "block"
}


function addExpense() {
  let kind = etype.value
  let data = {
    group: egroup.value.trim(),
    paid_by: paid.value.trim(),
    amount: Number(amt.value),
    type: kind,
    splits: []
  }

  if (kind !== "EQUAL") {
    split.value.split(',').forEach(x => {
      let p = x.split(':')
      if (kind === "EXACT") {
        data.splits.push({ name: p[0].trim(), amount: Number(p[1]) })
      } else {
        data.splits.push({ name: p[0].trim(), percent: Number(p[1]) })
      }
    })
  }

  fetch('/api/expense', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    emsg.innerText = "Expense added"
    amt.value = ""
    split.value = ""
  })
}


function viewBalance() {
  fetch(`/api/balances/${bgroup.value.trim()}/${buser.value.trim()}`)
    .then(r => r.json())
    .then(d => {
      list.innerHTML = ""

      if (d.owe.length === 0 && d.owed.length === 0) {
        list.innerHTML = "<li>No balances</li>"
        return
      }

      d.owed.forEach(x => {
        let li = document.createElement("li")
        li.innerText = x.name + " owes you " + x.amount
        list.appendChild(li)
      })

      d.owe.forEach(x => {
        let li = document.createElement("li")
        li.innerText = "You owe " + x.name + " " + x.amount
        list.appendChild(li)
      })
    })
}


function resetApp() {
  if (!confirm("Do you want to create a new entry?")) return

  fetch('/api/reset', { method: 'POST' })
    .then(() => {
      list.innerHTML = ""
      gmsg.innerText = ""
      emsg.innerText = ""
      rmsg.innerText = "New entry started"
    })
}

toggleSplitBox()
