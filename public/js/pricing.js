
(function(){
  const typeEl = document.getElementById('type');
  const weightEl = document.getElementById('weight');
  const condEl = document.getElementById('condition');
  const sizeEl = document.getElementById('size');
  const out = document.getElementById('estPrice');

  function basePricePerGram(type){
    const map = {
      'amethyst': 2.5,
      'rose_quartz': 1.8,
      'clear_quartz': 1.2,
      'citrine': 3.0,
      'black_onyx': 1.5,
      'aquamarine': 6.0,
      'jade': 8.0,
      'tourmaline': 10.0,
      'others': 1.0
    };
    return map[type] ?? map['others'];
  }
  function conditionMultiplier(c){
    const map = { 'mint':1.0, 'good':0.85, 'fair':0.65, 'poor':0.45 };
    return map[c] ?? 0.6;
  }
  function sizeBonus(s){
    const map = { 'xs':0, 's':5, 'm':12, 'l':25, 'xl':45 };
    return map[s] ?? 0;
  }
  function calc(){
    const type = typeEl?.value || 'others';
    const w = Number(weightEl?.value || 0);
    const cond = condEl?.value || 'good';
    const size = sizeEl?.value || 'm';
    const price = Math.round((basePricePerGram(type) * Math.max(0,w)) * conditionMultiplier(cond) + sizeBonus(size));
    if(out) out.textContent = isFinite(price) ? `$${Math.max(0,price)}` : '$0';
  }
  ['change','keyup','input'].forEach(evt=>{
    typeEl?.addEventListener(evt, calc);
    weightEl?.addEventListener(evt, calc);
    condEl?.addEventListener(evt, calc);
    sizeEl?.addEventListener(evt, calc);
  });
  calc();
})();
