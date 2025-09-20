// Cardápio simples com controle de estoque
// inStock=false desabilita o item (ex.: Lasanha e Coca PET 2L)
window.MENU = [
  { category: "Pratos", items: [
    { name:"Feijoada", size:"Serve 1 pessoa", priceCents:2000, inStock:true },
    { name:"Dobradinha", size:"Serve 1 pessoa", priceCents:2000, inStock:true },
    { name:"Lasanha", size:"Serve 1 pessoa", priceCents:2500, inStock:false }
  ]},
  { category: "Porções 500 ml", items: [
    { name:"Feijoada 500 ml", size:"500 ml", priceCents:1800, inStock:true }
  ]},
  { category: "Porções 1000 ml", items: [
    { name:"Feijoada 1000 ml", size:"1000 ml", priceCents:3000, inStock:true }
  ]},
  { category: "Bebidas", items: [
    { name:"Coca lata 350 ml", size:"350 ml", priceCents:500, inStock:true },
    { name:"Coca PET 2L", size:"2 L", priceCents:1400, inStock:false }
  ]},
  { category: "Sobremesas", items: [
    { name:"Pudim", size:null, priceCents:800, inStock:true }
  ]}
];
