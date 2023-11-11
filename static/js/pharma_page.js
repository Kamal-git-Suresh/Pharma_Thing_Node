function sendHello(pat_id, presc_id, doc_id){
    var aaa = 'hello';
    const dataToSend = {
        pat_id: pat_id,
        presc_id: presc_id,
        doc_id: doc_id
      };
    console.log(dataToSend);
    fetch('/hello', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('AAAA');
            }
            return response.json();
        })
        .then(data => {
            console.log('data: ', data.JSON);
            console.log('button Id: ',data.doc_id, '-', data.presc_id)
            var button = document.getElementById(data.presc_id);
            button.innerText = 'Prescribed';
            button.disabled = true;
        })
        .catch(error => {
            console.log('error: ', error);
        });
}