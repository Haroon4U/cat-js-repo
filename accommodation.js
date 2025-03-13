
	/*
	|--------------------------------------------------------------------------
	| Accommodation Manager
	|--------------------------------------------------------------------------
	*/
    // // Configuration
    $(document).off('.do-accommodation_configuration').on('click', '.do-accommodation_configuration', function(e){
        e.preventDefault();
        var url = root_url + '/accommodation/configuration';
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        c_view_controller(url, 'POST', {}).then(() => {
        loadingStop();
        });
    });

    // Accommodation
    $(document).off('click','.do-accommodation_type').on('click', '.do-accommodation_type', function(e){
        e.preventDefault();
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        var url = root_url + '/accommodation/type';
        c_view_controller(url, 'POST', {}).then(() => {
        loadingStop();
        });
    });
    $(document).off('click', '.create-accommodation_type').on('click', '.create-accommodation_type', function(e) {
        var url = root_url + '/accommodation/type/create';
        edit_view_content_popup(url, "Post", {});
    });
    $(document).off('click', '.edit-accommodation_type').on('click', '.edit-accommodation_type', function(e) {
        e.preventDefault();
        try {
        setTimeout(function() {
            var currentRowId = getSelectedRowIds(table, $(this));
            if(!currentRowId) return;
            var currentRowIds = getCurrentPageId(table);
            var postData = { 
                'root_id': currentRowId,
                'rowsIds': currentRowIds
            };
            var url = root_url + '/accommodation/type/create';
            edit_view_content_popup(url, 'post', postData);
        }, 100);
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('submit', '#accommodation_type-postData').on('submit', '#accommodation_type-postData', function(event) {
        event.preventDefault();
        let form = this;
        let postData = new FormData(this);
        $(form).find(':submit').attr('disabled','disabled');
        var url = root_url + '/accommodation/type/store';
        var method = "POST";
        sendRequestToServer(postData, url, method)
        .then((data) => {
            if (data.success) {
            reloadTablePreservingState();
            }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(form).find(':submit').removeAttr('disabled');
        });
    });
    $(document).off('click', '.status-accommodation_type').on('click', '.status-accommodation_type', function(event) {
        event.preventDefault();
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var status = $(this).data('status');
        var url = root_url + '/accommodation/type/status';
        var formData = {
            ids: currentRowId,
            status: status
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            reloadTablePreservingState();
            dialogBoxPopup.modal('hide');
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    $(document).off('click', '.delete-accommodation_type').on('click', '.delete-accommodation_type', function(event) {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete the selected rows?")) {
            return;
        }
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var url = root_url + '/accommodation/type/destroy';
        var formData = {
        ids: currentRowId,
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            reloadTablePreservingState();
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    var AccommodationNextPrevious = {
        context: {
        isFormDirty: false,
        rowsIds: [],
        currentId: null, 
        endpoint: 'accommodation/type/create',
        viewContentPopup: edit_view_content_popup
        },
        init: () => {
        NextPreviousNavigator.init(AccommodationNextPrevious.context);
        },
        updateContext: (newRowsIds, newCurrentId) => {
        AccommodationNextPrevious.context.rowsIds = newRowsIds;
        AccommodationNextPrevious.context.currentId = newCurrentId;
        NextPreviousNavigator.updateNavigationButtons(AccommodationNextPrevious.context);
        }
    };
    function get_accommodation_type_record(id) {
        if (!id) {
            errorToast('ID Not Found - Please Contact Administration');
            return; 
        }
        var url = root_url + '/accommodation/type/show/' + id;
        $.ajax({
        method: "GET",
        url: url,
        success: function(data) {
            if (!data.accommodation_type) { 
                loadingStop();
                errorToast('Record Not Found - Please Contact Administration');
                return false;
            }
            $('#accommodation_name').val(data.accommodation_type.accommodation_name);
            $('#description').val(data.accommodation_type.description);
            $('#location').val(data.accommodation_type.location);
            $('#price').val(data.accommodation_type.price);
            $('#capacity').val(data.accommodation_type.capacity);
            $('select[name="lead_assign[]"]').val(
                Array.isArray(data.accommodation_type.lead_assign) 
                ? data.accommodation_type.lead_assign 
                : JSON.parse(data.accommodation_type.lead_assign || "[]")
            ).change();
            Promise.resolve().then(function() {
            dialogBoxPopup.modal('show');
            loadingStop();
            });
        },
        error: function(xhr) {
            loadingStop();
            handleAjaxError(xhr);
        }
        });
    }
    // Accommodation Room
    $(document).off('click','.do-accommodation_room').on('click', '.do-accommodation_room', function(e){
        e.preventDefault();
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        var url = root_url + '/accommodation/room';
        c_view_controller(url, 'POST', {}).then(() => {
        loadingStop();
        });
    });
    $(document).off('click', '.create-accommodation_room').on('click', '.create-accommodation_room', function(e) {
        var url = root_url + '/accommodation/room/create';
        edit_view_content_popup(url, "Post", {});
    });
    $(document).off('click', '.edit-accommodation_room').on('click', '.edit-accommodation_room', function(e) {
        e.preventDefault();
        try {
        setTimeout(function() {
            var currentRowId = getSelectedRowIds(table, $(this));
            if(!currentRowId) return;
            var currentRowIds = getCurrentPageId(table);
            var postData = { 
                'root_id': currentRowId,
                'rowsIds': currentRowIds
            };
            var url = root_url + '/accommodation/room/create';
            edit_view_content_popup(url, 'post', postData);
        }, 100);
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('submit', '#accommodation_room-postData').on('submit', '#accommodation_room-postData', function(event) {
        event.preventDefault();
        let form = this;
        let postData = new FormData(this);
        $(form).find(':submit').attr('disabled','disabled');
        var url = root_url + '/accommodation/room/store';
        var method = "POST";
        sendRequestToServer(postData, url, method)
        .then((data) => {
            if (data.success) {
            reloadTablePreservingState();
            }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(form).find(':submit').removeAttr('disabled');
        });
    });
    $(document).off('click', '.status-accommodation_room').on('click', '.status-accommodation_room', function(event) {
        event.preventDefault();
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var status = $(this).data('status');
        var url = root_url + '/accommodation/room/status';
        var formData = {
            ids: currentRowId,
            status: status
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            reloadTablePreservingState();
            dialogBoxPopup.modal('hide');
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    $(document).off('click', '.delete-accommodation_room').on('click', '.delete-accommodation_room', function(event) {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete the selected rows?")) {
            return;
        }
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var url = root_url + '/accommodation/room/destroy';
        var formData = {
        ids: currentRowId,
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            reloadTablePreservingState();
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    var AccommodationRoomNextPrevious = {
        context: {
        isFormDirty: false,
        rowsIds: [],
        currentId: null, 
        endpoint: 'accommodation/room/create',
        viewContentPopup: edit_view_content_popup
        },
        init: () => {
        NextPreviousNavigator.init(AccommodationRoomNextPrevious.context);
        },
        updateContext: (newRowsIds, newCurrentId) => {
        AccommodationRoomNextPrevious.context.rowsIds = newRowsIds;
        AccommodationRoomNextPrevious.context.currentId = newCurrentId;
        NextPreviousNavigator.updateNavigationButtons(AccommodationRoomNextPrevious.context);
        }
    };


    // // Room Allocated
    $(document).off('click','.do-room_allocation').on('click', '.do-room_allocation', function(e){
        e.preventDefault();
        var url = root_url + 'accommodation/room_allocation';
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        c_view_controller(url, 'POST', {}).then(() => {
            loadingStop();
        });
    });
    $(document).off('click', '.create-room_allocation').on('click', '.create-room_allocation', function(e){
        try{
        var url = root_url + '/accommodation/room_allocation/create';
        edit_view_content_popup(url, 'post', {});
        }catch(error){
        handleAjaxError(error);
        }
    });
    $(document).off('click', '.edit-room_allocation').on('click', '.edit-room_allocation', function(e) {
        e.preventDefault();
        try {
        setTimeout(function() {
            var currentRowId = getSelectedRowIds(table, $(this));
            if(!currentRowId) return;
            var currentRowIds = getCurrentPageId(table);
            var postData = { 
                'root_id': currentRowId,
                'rowsIds': currentRowIds
            };
            var url = root_url + '/accommodation/room_allocation/create';
            edit_view_content_popup(url, 'post', postData);
        }, 100);
        } catch (error) {
        handleAjaxError(error);
        }
    });

    $(document).off('submit', '#room_allocation-postData').on('submit', '#room_allocation-postData', function(event) {
        event.preventDefault();
        loadingStart();
        let self = this;
        let formId = $(self).attr('id');
        let buttonSubmit = $(`button[form="${formId}"]`);
        $(buttonSubmit).attr('disabled', 'disabled');
        $(self).attr('disabled', 'disabled');
        let postData = new FormData(this);

        var url = root_url + '/accommodation/room_allocation/store';
        sendRequestToServer(postData, url, "Post")
        .then((data) => {
            if (data.success) {
                dialogBoxPopup.find('.modal-title').html(data.title);
                dialogBoxPopup.find('.modal-sub-title').html(data.sub_title);
                $('input[name="room_allocation_id"]').val(data.query.id);
                get_room_allocation(data.query.id);
                updateComposerField(data.module, data.query.id);
                getMailContent();
                reloadTablePreservingState();
            }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(self).removeAttr('disabled');
            $(buttonSubmit).removeAttr('disabled');
            loadingStop();
        });
    });
    $(document).off('click', '.delete-room_allocation').on('click', '.delete-room_allocation', function(event) {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete the selected rows?")) {
            return;
        }
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var url = root_url + '/accommodation/room_allocation/destroy';
        var formData = {
        ids: currentRowId,
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            reloadTablePreservingState();
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    $(document).off('click', '.export-room_allocation').on('click', '.export-room_allocation', function(event){
        event.preventDefault();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var form = $('<form>');
        form.attr('method', 'post');
        form.attr('action', '/accommodation/room_allocation/export');
        form.attr('target', '_blank');
        form.append($('<input>').attr('type', 'hidden').attr('name', 'selectedRow').val(currentRowId));
        $('body').append(form);
        form.submit();
        form.remove();
    });
    $(document).off('click', '.transfer-room_allocation').on('click', '.transfer-room_allocation', function(e) {
        e.preventDefault();
        try {
        setTimeout(function() {
            var selectedRows = table.rows({ selected: true }).data().pluck('id').toArray();
            if (selectedRows.length > 0) {
                selectedRowIds = selectedRows.join(',');
            } else {
                errorToast('No row selected.');
                return null;
            }
            var postData = { 
                'root_id': selectedRowIds,
            };
            var url = root_url + '/accommodation/room_allocation/transfer/view';
            edit_view_content_popup(url, 'post', postData);
        }, 100);
        } catch (error) {
        handleAjaxError(error);
        }
    });

    $(document).off('submit', '#room_allocation_transfer-postData').on('submit', '#room_allocation_transfer-postData', function(event) {
        event.preventDefault();
        loadingStart();
        let form = this;
        let postData = new FormData(this);
        $(form).find(':submit').attr('disabled','disabled');
        var url = root_url + '/accommodation/room_allocation/transfer/store';
        var method = "POST";
        sendRequestToServer(postData, url, method)
        .then(() => {
            dialogBoxPopup.modal('hide');
            reloadTablePreservingState();
            loadingStop();
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(form).find(':submit').removeAttr('disabled');
            loadingStop();
        });
    });

    var RoomAllocatedNextPrevious = {
        context: {
        isFormDirty: false,
        rowsIds: [],
        currentId: null, 
        endpoint: 'accommodation/room_allocation/create',
        viewContentPopup: edit_view_content_popup
        },
        init: () => {
            NextPreviousNavigator.init(RoomAllocatedNextPrevious.context);
        },
        updateContext: (newRowsIds, newCurrentId) => {
            RoomAllocatedNextPrevious.context.rowsIds = newRowsIds;
            RoomAllocatedNextPrevious.context.currentId = newCurrentId;
            NextPreviousNavigator.updateNavigationButtons(RoomAllocatedNextPrevious.context);
        }
    };
    $(document).off('change', 'select[name="accommodation_id"]').on('change', 'select[name="accommodation_id"]', function() {
        var accommodation = $(this).val();
        get_available_category(accommodation,null)
    });
    function get_available_category(accommodation, category) {
        return new Promise((resolve, reject) => {
            var dropDown = $('select[name="room_category"]');
            $('select[name="room_id"]').empty();
            var url = `${root_url}/accommodation/room/available_category/${accommodation}/${category}`;
            
            $.ajax({
                method: 'get',
                url: url,
                cache: false,
                success: function(data) {
                    if (data.error) {
                        errorToast(data.message);
                        return reject(new Error(data.message));
                    }
                    dropDown.empty();
                    $.each(data, (key, value) => {
                        dropDown.append(`<option value="${value.category}">${value.category}</option>`);
                    });
                    dropDown.val(category);
                    resolve();
                },
                error: function(xhr) {
                    loadingStop();
                    reject(xhr);
                }
            });
        });
    }
    $(document).off('change', 'select[name="room_category"]').on('change', 'select[name="room_category"]', function() {
        var room_category = $(this).val();
        var accommodation = $('select[name="accommodation_id"]').val();
        get_available_room(accommodation,room_category,null)
    });
    function get_available_room(accommodation,room_category, room_id) {
        return new Promise((resolve, reject) => {
            var dropDown = $('select[name="room_id"]');
            var url = `${root_url}/accommodation/room/available_room/${accommodation}/${room_category}/${room_id}`;
            
            $.ajax({
                method: 'get',
                url: url,
                cache: false,
                success: function(data) {
                    if (data.error) {
                        errorToast(data.message);
                        return reject(new Error(data.message));
                    }
                    dropDown.empty();
                    $.each(data, (key, value) => {
                        dropDown.append(`<option value="${value.id}">${value.room_number}</option>`);
                    });
                    dropDown.val(room_id);
                    resolve();
                },
                error: function(xhr) {
                    loadingStop();
                    reject(xhr);
                }
            });
        });
    }

        // Camp idle
        $(document).off('click','.do-camp_idle').on('click', '.do-camp_idle', function(e){
            e.preventDefault();
            $('#sidebar-menu').find('.active').removeClass('active');
            $(this).addClass('active');
            $('.main-wrapper').removeClass('slide-nav');
            $('.sidebar-overlay').removeClass('opened');
            var url = root_url + '/camp_idle';
            c_view_controller(url, 'POST', {}).then(() => {
            loadingStop();
            });
        });
        $(document).off('click', '.create-camp_idle').on('click', '.create-camp_idle', function(e) {
            var url = root_url + '/camp_idle/create';
            edit_view_content_popup(url, "Post", {});
        });
        $(document).off('click', '.edit-camp_idle').on('click', '.edit-camp_idle', function(e) {
            e.preventDefault();
            try {
            setTimeout(function() {
                var currentRowId = getSelectedRowIds(table, $(this));
                if(!currentRowId) return;
                var currentRowIds = getCurrentPageId(table);
                var postData = { 
                    'root_id': currentRowId,
                    'rowsIds': currentRowIds
                };
                var url = root_url + '/camp_idle/create';
                edit_view_content_popup(url, 'post', postData);
            }, 100);
            } catch (error) {
            handleAjaxError(error);
            }
        });
        $(document).off('submit', '#camp_idle-postData').on('submit', '#camp_idle-postData', function(event) {
            event.preventDefault();
            let form = this;
            let postData = new FormData(this);
            $(form).find(':submit').attr('disabled','disabled');
            var url = root_url + '/camp_idle/store';
            var method = "POST";
            sendRequestToServer(postData, url, method)
            .then((data) => {
                if (data.success) {
                reloadTablePreservingState();
                }
            }).catch((error) => {
                handleAjaxError(error);
            }).finally(() => {
                $(form).find(':submit').removeAttr('disabled');
            });
        });
        $(document).off('click', '.status-camp_idle').on('click', '.status-camp_idle', function(event) {
            event.preventDefault();
            loadingStart();
            var currentRowId = getSelectedRowIds(table, $(this));
            if(!currentRowId) return;
            var status = $(this).data('status');
            var url = root_url + '/camp_idle/status';
            var formData = {
                ids: currentRowId,
                status: status
            };
            $.post(url, formData, function(response) {
            loadingStop();
            if (response.success) {
                reloadTablePreservingState();
                dialogBoxPopup.modal('hide');
            } else {
                errorToast(response.message);
            }
            }).fail(function(xhr) {
            loadingStop();
                handleAjaxError(xhr);
            });
        });
        $(document).off('click', '.delete-camp_idle').on('click', '.delete-camp_idle', function(event) {
            event.preventDefault();
            if (!confirm("Are you sure you want to delete the selected rows?")) {
                return;
            }
            loadingStart();
            var currentRowId = getSelectedRowIds(table, $(this));
            if(!currentRowId) return;
            var url = root_url + '/camp_idle/destroy';
            var formData = {
            ids: currentRowId,
            };
            $.post(url, formData, function(response) {
            loadingStop();
            if (response.success) {
                reloadTablePreservingState();
            } else {
                errorToast(response.message);
            }
            }).fail(function(xhr) {
            loadingStop();
                handleAjaxError(xhr);
            });
        });
        var CampIdleNextPrevious = {
            context: {
            isFormDirty: false,
            rowsIds: [],
            currentId: null, 
            endpoint: 'camp_idle/create',
            viewContentPopup: edit_view_content_popup
            },
            init: () => {
            NextPreviousNavigator.init(CampIdleNextPrevious.context);
            },
            updateContext: (newRowsIds, newCurrentId) => {
            CampIdleNextPrevious.context.rowsIds = newRowsIds;
            CampIdleNextPrevious.context.currentId = newCurrentId;
            NextPreviousNavigator.updateNavigationButtons(CampIdleNextPrevious.context);
            }
        };
        $(document).off('click', '.export-camp_idle').on('click', '.export-camp_idle', function(event){
            event.preventDefault();
            var currentRowId = getSelectedRowIds(table, $(this));
            if(!currentRowId) return;
            var form = $('<form>');
            form.attr('method', 'post');
            form.attr('action', '/camp_idle/export');
            form.attr('target', '_blank');
            form.append($('<input>').attr('type', 'hidden').attr('name', 'selectedRow').val(currentRowId));
            $('body').append(form);
            form.submit();
            form.remove();
        });