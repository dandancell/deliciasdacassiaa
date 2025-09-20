(function(){
  const menuDiv = document.getElementById('menu');
  const cartDiv = document.getElementById('cart');
  const totalSpan = document.getElementById('total');
  const result = document.getElementById('result');

  const cart = []; // {name,size,priceCents,qty}

  function money(cents){ return 'R$ ' + (cents/100).toFixed(2).replace('.',','); }
  function total(){ return cart.reduce((s,i)=>s + i.priceCents*i.qty, 0); }
  function renderCart(){
    if(cart.length===0){ cartDiv.innerHTML = '<p>Seu carrinho está vazio.</p>'; totalSpan.textContent = money(0); return; }
    const rows = cart.map((i,idx)=>`
      <div class="row">
        <div style="flex:1">${i.qty}× ${i.name}${i.size?` (${i.size})`:''}</div>
        <div>${money(i.priceCents*i.qty)}</div>
        <button class="button" type="button" onclick="__rm(${idx})">Remover</button>
      </div>
    `).join('');
    cartDiv.innerHTML = rows;
    totalSpan.textContent = money(total());
  }
  window.__rm = function(i){ cart.splice(i,1); renderCart(); }

  function addItem(it){
    const found = cart.find(c=>c.name===it.name && c.size===it.size);
    if(found) found.qty += 1;
    else cart.push({ name:it.name, size:it.size, priceCents:it.priceCents, qty:1 });
    renderCart();
  }

  function renderMenu(){
    const html = window.MENU.map(cat=>`
      <h3>${cat.category}</h3>
      <div class="menu-grid">
        ${cat.items.map(it=>`
          <div class="item">
            <div class="title">${it.name}${it.size?` – ${it.size}`:''}
              ${!it.inStock ? '<span class="soldout">Esgotado</span>' : ''}
              <span class="price">${money(it.priceCents)}</span>
            </div>
            <div class="qty">
              <button class="button" type="button" ${!it.inStock?'disabled':''}
                onclick='__add(${JSON.stringify(it).replace(/'/g,"&#39;")})'>
                Adicionar
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
    menuDiv.innerHTML = html;
  }
  window.__add = addItem;

  async function submitOrder(e){
    e.preventDefault();
    result.textContent='';
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const notes = document.getElementById('notes').value.trim();
    if(!name) { result.textContent='Informe seu nome.'; return; }
    if(cart.length===0){ result.textContent='Adicione itens ao carrinho.'; return; }

    const payload = {
      customerName: name,
      customerPhone: phone || undefined,
      notes,
      items: cart.map(i => ({
        name: i.name, size: i.size, qty: i.qty, priceCents: i.priceCents
      }))
    };

    try{
      const res = await fetch((window.DELICIAS_API_BASE || '') + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({error:'Erro'}));
        throw new Error(err.error || 'Falha ao enviar pedido');
      }
      const data = await res.json();
      result.style.color = 'green';
      result.textContent = 'Pedido enviado! Código: ' + data._id;
      // limpa carrinho
      cart.length = 0; renderCart();
      document.getElementById('order-form').reset();
    }catch(err){
      result.style.color = 'crimson';
      result.textContent = err.message;
    }
  }

  document.getElementById('order-form').addEventListener('submit', submitOrder);

  // status de funcionamento (fixo ao exemplo que você pediu)
  document.getElementById('status-text').textContent = abertoAgora() ? 'Aberto até as 15:00' : 'Fechado, funcionamos aos sábados e domingos das 11:00 às 15:00';
  function abertoAgora(){
    const now = new Date();
    const dia = now.getDay(); // 0=Dom
    const hora = now.getHours() + now.getMinutes()/60;
    const fim = 15; const ini = 11;
    const fimSemana = (dia===0 || dia===6);
    return fimSemana && hora>=ini && hora<=fim;
  }

  renderMenu(); renderCart();
})();
