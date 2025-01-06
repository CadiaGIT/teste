document.getElementById('calculateBtn').addEventListener('click', function() {
    const service1 = parseInt(document.getElementById('service1').value) || 0;
    const service2 = parseInt(document.getElementById('service2').value) || 0;
    const service3 = parseInt(document.getElementById('service3').value) || 0;

    const total = (service1 * 50) + (service2 * 40) + (service3 * 30);
    document.getElementById('totalDevis').textContent = "Total : " + total + "€";
});