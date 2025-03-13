    import EditableTable from '/web/assets/plugins/editableTable/EditableTable.js';

    var editableTable;
    var isFormDirty = false;
        localStorage.removeItem('module-demobilization_root_id');
    if (demobilization_id) {
        localStorage.setItem('module-demobilization_root_id', demobilization_id);
    }
    $(document).ready(async function() {
        initializeDateInputMask();
        toggleFieldAttributes('.has_edit', hasEdit);
        editableTable = new EditableTable({
            tableSelector: '.c_list_table',
            addButtonSelector: '.add-line',
            buttonRow: '.c_field_x2many_list_row_add',
            td: [
                { name: 'employee_id', type: 'select', class: 'c_line_employee_id c_required_modifier', function: getDemobilizationLineEmployee,
                    field: [{ attributes: { class: "form-control employee_id has_edit required", required: true } }]},
                { name: 'employee_name', type: 'text', class: 'employee_name-cell' },
                { name: 'designation', type: 'text', class: 'designation-cell' },
                { name: 'demob_date', type: 'input', class: 'c_required_modifier', function: getDemobilizationDate,
                    field: [{ attributes: { mask: "date", class: "form-control has_edit required last_working_date", required: true } }]},
                { name: 'description', type: 'input', field: [{ attributes: { class: "form-control" } }]},
                { type: 'button', field: [{ html: `<button type="button" class="btn border-0 rounded-pill p-1 has_edit delete-line"><i class="fa fa-fw fa-trash-alt"></i></button>` }] }
            ]
        });
        $('[name="cause_of_action"]').select2({placeholder: 'Select Type ',theme:'classic'});
        $('select[name="demobilization_project"]').select2({ 
            placeholder: "Select Project",
            theme: "classic",
            ajax: {
                url: root_url + '/project/many2One',
                dataType: 'json',
            }
        });
        if(demobilization_id){
            await get_demobilization(demobilization_id);
        }else{
            loadingStop();
        }
        $('#demobilization-postData').on('input change', 'input, textarea, select', function() {
            isFormDirty = true;
        });
        DemobilizationNextPrevious.init();

        DemobilizationNextPrevious.updateContext(rowsIds, currentId);
    });

    async function get_demobilization(root) {
        try {
            const url = root_url + '/demobilization/show/' + root;
            const data = await $.ajax({
                method: "GET",
                url: url
            });
            if(!data.demob.id){
                errorToast('Record Not found.Contact Administration')
                return false;
            }
            $('.status-confirm,.validate').addClass('d-none');
            $('.status-cancelled,.preview-demobilization,fullComposer-demobilization').removeClass('d-none');

            toggleFieldAttributes('.has_edit', false);
            editableTable.destroy();
            if(data.demob.status == "draft"){
                $('.status-confirm').removeClass('d-none');
                toggleFieldAttributes('.has_edit', true);
                editableTable.reinitialize();
            }else if(data.demob.status == "awaiting approval" && data.demob.pending_approval == data.user_id){
                $('.validate').removeClass('d-none');
            }else{
                $('.status-cancelled').addClass('d-none');
            }

            // Populate the form with fetched data
            $('[name="date"]').val(data.date);
            $('[name="cause_of_action"]').val(data.demob.cause_of_action).change();

            $('textarea[name="description"]').text(data.demob.description);        
            
            
            await Promise.all([
                new Promise((resolve, reject) => {
                    $('[name="demobilization_project"]').append(new Option(data.demob.site.site_name, data.demob.site_id, true, true)).trigger('change');
                    populateDemobilizationLines (data.lines).then(() => {
                        isFormDirty = false;
                    });

                    resolve();
                }),
                updateComposerField(data.module, data.demob.id),
                getMailContent(),
            ]);

        } catch (error) {
            handleAjaxError(error);
        } finally {
            isFormDirty = false;
            loadingStop();
        }
    }

    function populateDemobilizationLines(lines) {
        $('.c_editable_list > tbody').find('tr:not(:has(.c_field_x2many_list_row_add))').remove();
        let allRows = [];
        lines.forEach((d, index) => {
            let rowCount = index + 1;
            let rowHTML = c_dataRow(rowCount, {
                line_id: d.id ?? '',
                badge: d.employee.badge ?? '',
                employee_name: d.employee.full_name ?? '',
                designation: d.employee.designation?.designation_name ?? '',
                demob_date: formatDate(d.demob_date) ?? '',
                reason: d.reason ?? '',
            });
            allRows.push(rowHTML);
        });
        $('.c_editable_list > tbody').prepend(allRows.join(''));
        let $lastDataCellRow = $('.c_editable_list > tbody').find('tr:has(.c_data_cell)').last();
        let $x2manyRow = $('.c_editable_list > tbody').find('tr:has(.c_field_x2many_list_row_add)');
        if ($lastDataCellRow.length && $x2manyRow.length) {
            $x2manyRow.detach().insertAfter($lastDataCellRow);
        }
        initializeDateInputMask();

        return Promise.resolve();
    }
    function c_dataRow(rowCount, data = {}) {
        const {
            line_id = '',
            badge = '',
            employee_name = '',
            designation = '',
            demob_date = '',
            reason = '',
        } = data;


        let rowHTML = `<tr class="c_data_row" data-id="${line_id}">
                            <td class="c_data_cell c_field_cell c_required_modifier c_line_employee_id" name="employee_id">${badge}</td>
                            <td class="c_data_cell c_field_cell employee_name-cell" name="employee_name">${employee_name}</td>
                            <td class="c_data_cell c_field_cell designation-cell" name="designation">${designation}</td>
                            <td class="c_data_cell c_field_cell c_required_modifier" name="demob_date">${demob_date}</td>
                            <td class="c_data_cell c_field_cell" name="description">${reason}</td>
                            <td class="c_data_cell c_field_cell"></td>
                        </tr>`;

        var newRowElement = $(rowHTML);
        return newRowElement[0].outerHTML;
    }
    $(document).off('change', '[name="demobilization_project"]').on('change', '[name="demobilization_project"]', async function(e) {
        editableTable.deleteAllRows();
    });
    $(document).off('change', '.employee_id').on('change', '.employee_id', async function(e) {
        e.preventDefault();
        try {
            var row = $(this).closest('tr');
            var employeeId = $(this).val();
            const res = await $.post(root_url + '/human_resource/employee/record/belongTo', { employee_id: employeeId });
            if (res) {
                row.find('.employee_name-cell').text(res.full_name);
                row.find('.designation-cell').text(res.designation.designation_name);
            } else {
                errorToast(res);
            }
        } catch (error) {
            handleAjaxError(error);
        }
    });
    $(document).off('submit','#demobilization-postData').on('submit','#demobilization-postData', function (event) {
        event.preventDefault();
        loadingStart();
        let submitButton = $('button[form="demobilization-postData"]');
        let self = this;
        let postData = new FormData(self);
        let linesData = getDemobilizationLinesData();
            linesData.forEach(function (line, index) {
                postData.append('lines[' + index + '][line_id]', line.line_id);
                postData.append('lines[' + index + '][employee_id]', line.employee_id);
                postData.append('lines[' + index + '][demob_date]', line.demob_date);
                postData.append('lines[' + index + '][description]', line.description);
            });
        $(self).find(':submit').attr('disabled', 'disabled');
        submitButton.attr('disabled', 'disabled');
        var url = root_url + '/demobilization/store';
        sendRequestToServer(postData,url,'Post')
        .then((data) => {
        isFormDirty = false;
        if (data.success) {
            $('.page-title').find('h4').html(data.title);
            $('.page-title').find('.breadcrumb').html(data.sub_title);
            $('input[name="demobilization_id"]').val(data.query.id);
            if(data.refresh_table == true){
                get_demobilization(data.query.id);
                localStorage.setItem('module-demobilization_root_id', data.query.id);
            }
            updateComposerField(data.module, data.query.id);
            getMailContent();
            reloadTablePreservingState();
        }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(self).find(':submit').removeAttr('disabled');
            submitButton.removeAttr('disabled');
            loadingStop();
        });
    });
    $(document).off('click', '.status-demobilization').on('click', '.status-demobilization', function(e) {
        e.preventDefault();
        try {
        loadingStart();
        let submitButton = $('button[form="demobilization-postData"]');
        let self = this;
        var status = $(self).data('status');
        var currentRowId = localStorage.getItem('module-demobilization_root_id');
        if(!currentRowId) return;
        var url = root_url + '/demobilization/status';
        let postData = new FormData();
            postData.append('ids', currentRowId);
            postData.append('status', status);
        sendRequestToServer(postData,url,'Post')
        .then((data) => {
            isFormDirty = false;
            if (data.success) {
            $('.page-title').find('h4').html(data.title);
            if(data.refresh_table == true){
                get_demobilization(data.query.id);
            }
            updateComposerField(data.module, data.query.id);
            getMailContent();
            reloadTablePreservingState();
            }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(self).find(':submit').removeAttr('disabled');
            submitButton.removeAttr('disabled');
            loadingStop();
        });
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('click', '.validate-demobilization').on('click', '.validate-demobilization', function(e) {
        e.preventDefault();
        try {
        loadingStart();
        let submitButton = $('button[form="demobilization-postData"]');
        let self = this;
        var currentRowId = localStorage.getItem('module-demobilization_root_id');
        if(!currentRowId) return;
        var url = root_url + '/demobilization/validate';
        let postData = new FormData();
            postData.append('ids', currentRowId);
        sendRequestToServer(postData,url,'Post')
        .then((data) => {
            isFormDirty = false;
            if (data.success) {
            $('.page-title').find('h4').html(data.title);
            if(data.refresh_table == true){
                get_demobilization(data.query.id);
            }
            updateComposerField(data.module, data.query.id);
            getMailContent();
            reloadTablePreservingState();
            }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(self).find(':submit').removeAttr('disabled');
            submitButton.removeAttr('disabled');
            loadingStop();
        });
        } catch (error) {
        handleAjaxError(error);
        }
    });

    function getDemobilizationLinesData() {
        var linesData = [];
        $('.c_editable_list tbody .c_data_row').each(function() {
            var row = $(this);
            if (row.find('.c_line_employee_id').text().length > 0) {
                var lineData = {};
                lineData.line_id = row.attr('data-id') || '';
                lineData.employee_id = row.find('[name="employee_id"]').text().trim() || '';
                lineData.demob_date = row.find('[name="demob_date"]').text().trim() || '';
                lineData.description = row.find('[name="description"]').text().trim() || '';
                if (lineData.employee_id && lineData.demob_date) {
                    linesData.push(lineData);
                }
            }
        });

        return linesData;
    }
    function getDemobilizationLineEmployee(newRow) {
        var employeeIdsArray = [];
        var indexParent;

        var employeeDropdown = newRow.find('.employee_id');
        var project_id = $('[name="demobilization_project"]').val();


        $('.c_line_employee_id').each(function() {
            employeeIdsArray.push($(this).text().trim());
        });
        if (typeof dialogBoxPopup !== 'undefined' && $(dialogBoxPopup).length > 0) {
            indexParent = dialogBoxPopup;
        } else {
            indexParent = false;
        }
        return new Promise(function(resolve) {
            employeeDropdown.select2({
                placeholder: "Select Employee",
                theme: "classic",
                dropdownParent: indexParent,
                ajax: {
                    url: root_url + '/demobilization/manyToOne/employee',
                    dataType: 'json',
                    data: function(params) {
                        return {
                            q: params.term,
                            project_id: project_id,
                            exits_badge: employeeIdsArray
                        };
                    },
                }
            });
            resolve();
        });
    }
    function getDemobilizationDate(newRow) {
        var demob_date = newRow.find('.last_working_date');
        var date = $('[name="last_working_date"]').val();
        var indexParent;
        if (typeof dialogBoxPopup !== 'undefined' && $(dialogBoxPopup).length > 0) {
            indexParent = dialogBoxPopup;
        } else {
            indexParent = false;
        }
        if (demob_date.val().trim() === "") {
            demob_date.val(date);
        }
    }
    $(document).off('click', '.preview-demobilization').on('click', '.preview-demobilization', function(e) {
        e.preventDefault();
        try {
            setTimeout(function() {
            var currentRowId = localStorage.getItem('module-demobilization_root_id');
            if(!currentRowId) return;
            var url = root_url + '/demobilization/preview';
            var csrfToken = $('meta[name="csrf-token"]').attr('content');
            var form = $("<form method='post' action='" + url + "' target='_blank'>" +
                "<input type='hidden' name='_token' value='" + csrfToken + "'>" +
                "<input type='hidden' name='selected_rows' value='" + currentRowId + "'>" +
                "</form>");
            $("body").append(form);
            form.submit();
            form.remove();
            }, 60);
        } catch (error) {
            handleAjaxError(error);
        }
    });
    // $(document).off('click', '.fullComposer-demobilization').on('click', '.fullComposer-demobilization', function(e) {
    //     try {
    //         var currentRowId = localStorage.getItem('module-demobilization_root_id');
    //         if(!currentRowId) return;
    //         var url = root_url + '/visa_application/employment_visa/labour_contract/refuse/'+currentRowId;
    //         view_overlay_container(url, 'get');
    //     } catch (error) {
    //         handleAjaxError(error);
    //     }
    // });
    // $(document).off('submit', '#refuse-employment_visa_post').on('submit', '#refuse-employment_visa_post', function(event) {
    //     event.preventDefault();
    //     loadingStart();
    //     var url = root_url + '/visa_application/employment_visa/labour_contract/refuse';
    //     const formData = new FormData(this);
    //     formData.append('body_message', refuse_compose.getData());
    //     let files = $('#c-composer-input-files')[0].files;
    //     $.each(files, function(i, file) {
    //         formData.append('attachments[]', file);
    //     });
    //     $(this).attr('disabled', 'disabled');
    
    
    //     sendRequestToServer(formData, url,"POST")
    //     .then((data) => {
    //     if (data.success) {
    //         $('.employment_visa_awaiting').attr('data-id', '').hide();
    //         check_mb_st_type(data.employment_visa.mb_st_typing_date); 
    //         updateComposerField(data.module, data.employment_visa.id),
    //         getMailContent();
    //         reloadTablePreservingState();
    //     }
    //     }).catch((error) => {
    //     handleAjaxError(error);
    //     }).finally(() => {
    //         dialogBoxPopup.modal('hide');
    //         loadingStop();
    //     });
    // });

