var medicineList = [];

$(document).ready(function() {
    $('#medicine-name').on('input', function() {
        $('#btn-add').attr('disabled', $(this).val() == '')

    });

    $('#medicine-list').change(function() {
        console.log('change');
    });
});

function generate() {
    if (!checkField()) return;
    
    if ($('#patient-name').val() == "") {
        swal("Qrcode generate error", "Please input the patient's name!", "error");
        return;
    }
    if ($('#medicine-list .list-group-item>button').length == 0) {
        swal("Qrcode generate error", "Please input the medicines!", "error");
        return;
    }

    var medicineList = $('.list-group-item>button').map(function(e){ return $(this).val(); }).toArray();
    var json = JSON.stringify({
        partiantName: $('#patient-name').val(),
        medicines: medicineList
    });
    $('#qrcode').text('');
    new QRCode(document.getElementById("qrcode"), json);
}

function checkField() {
    if ($('#patient-name').val() == "") {
        swal("Qrcode generate error", "Please input the patient's name!", "error");
        return false;
    }
    if ($('#medicine-list .list-group-item>button').length == 0) {
        swal("Qrcode generate error", "Please input the medicines!", "error");
        return false;
    }
    return true; 
}

function addMedicine(medicine) {
    var content = $('#medicine-name').val();
    var elementTemplate = `
        <li class="list-group-item d-flex justify-content-between align-items-center">{medicineName}<button type="button" value="{medicineName}" class="btn btn-primary" onclick="removeMedicine(this)">Remove</button></li>
    `;
    elementTemplate = elementTemplate.replaceAll('{medicineName}', content);
    $('#medicine-list').append(elementTemplate);
}

function removeMedicine(e) {
    $(e).parent().remove();
}