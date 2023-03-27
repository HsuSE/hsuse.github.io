const medicineInfos = [
    {
        "uuid": "42df285c-ead1-411e-9645-18dc85b83afa",
        "name": "Combivir",
        "scientific_name": "Lamivudine",
        "abb_name": "3TC",
        "side_effect": "",
        "note": ""
    },
    {
        "uuid": "c0e2fe2d-ac17-41f8-80e1-26f0c2a9acf4",
        "name": "Kivexa",
        "scientific_name": "Abacavir",
        "abb_name": "ABC",
        "side_effect": "皮膚過敏",
        "note": ""
    },
    {
        "uuid": "26696fa2-cd16-485c-b7b8-05fa19d216c9",
        "name": "Viread",
        "scientific_name": "Tenofovir",
        "abb_name": "TDF",
        "side_effect": "腎功能下降",
        "note": ""
    },
]

var medicineList = [];

var selectedMedicineUuid;

$(document).ready(function() {
    $('#medicine-name').on('input', function() {
        $('#btn-add').attr('disabled', $(this).val() == '')

    });

    $('#medicine-list').change(function() {
        console.log('change');
    });

    $("select[name='medicine-info-selector']").html("");
    $("select[name='medicine-info-selector']").append("<option value='-1' selected>Select medicine</option>");
    medicineInfos.forEach(info => {
        var element = "<option value='"+ info.uuid + "'>" + info.name + "</option>";
        $("select[name='medicine-info-selector']").append(element);
    });

    $("select[name='medicine-info-selector']").on('change', function() {
        selectedMedicineUuid = $(this).val() == '-1' ? undefined : $(this).val();
        $('#btn-add').attr('disabled', $(this).val() == '-1')
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

    var json = JSON.stringify({
        userId: "9b8f9372-dde9-4dd4-92ca-f92a6165a069",
        partiantName: $('#patient-name').val(),
        interval: parseInt($('#therapy-interval').val()),
        times: parseInt($('#therapy-times').val()),
        amount: parseInt($('#medicine-amount').val()),
        medicines: medicineList
    });
    $('#qrcode').text('');
    console.log(json);
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

function addMedicine() {
    if (selectedMedicineUuid == undefined) return;
    var isAdded = medicineList.filter((e)=>{
        if (e.medicine_uuid == selectedMedicineUuid)
            return true;
        return false;
    }).length > 0;

    if (isAdded) {
        alert("Medicine already added");
        return;
    }

    var medicineInfo = medicineInfos.filter((e)=>{
        if (e.uuid == selectedMedicineUuid)
            return true;
        return false;
    })[0];
    medicineList.push({
        "medicine_uuid": medicineInfo.uuid,
        "amount": 1,
        "unit": "g"
    });
    loadSelectedMedicineList();
}

function removeMedicineAt(idx) {
    medicineList.splice(idx, 1);
    loadSelectedMedicineList();
}

function loadSelectedMedicineList() {
    $('#medicine-list').html('');
    for (var idx = 0; idx < medicineList.length; idx++) {
        var medicineInfo = medicineInfos.find((e) => e.uuid == medicineList[idx].medicine_uuid);

        var elementTemplate = `
            <li class="list-group-item d-flex justify-content-between align-items-center">{medicineName}<button type="button" value="{medicineName}" class="btn btn-primary" onclick="removeMedicineAt({idx})">Remove</button></li>
        `;
        elementTemplate = elementTemplate.replaceAll('{medicineName}', medicineInfo.name);
        elementTemplate = elementTemplate.replaceAll('{idx}', idx);
        $('#medicine-list').append(elementTemplate);
    }
}