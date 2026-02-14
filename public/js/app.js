$(document).ready(function () {

    // Login Form Submit
    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        const key = $('#api-key').val();

        $.ajax({
            url: '/api/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ apiKey: key }),
            success: function (response) {
                window.location.href = '/dashboard';
            },
            error: function (xhr) {
                if (xhr.status === 429) {
                    $('#login-error').text('Too many login attempts, please try again later').show();
                } else {
                    $('#login-error').text('Invalid API Key').show();
                }
            }
        });
    });

    // Only load endpoints if we are on the dashboard
    if (window.location.pathname === '/dashboard') {
        loadEndpoints();
    }

    // Create Endpoint Form Submit
    $('#create-endpoint-form').on('submit', function (e) {
        e.preventDefault();

        let responseBody;
        try {
            responseBody = JSON.parse($('#responseBodyInJson').val());
        } catch (err) {
            $('#create-endpoint-message').text('Invalid JSON in Response Body')
                .addClass('error')
            $('#create-endpoint-message').text('Invalid JSON in Response Body')
                .addClass('error')
                .css('color', 'var(--neon-red)')
                .show();
            return;
        }

        const data = {
            myUniqueKey: $('#myUniqueKey').val(),
            endpoint: $('#endpoint').val(),
            httpVerb: $('#httpVerb').val(),
            responseCode: parseInt($('#responseCode').val()),
            responseBodyInJson: responseBody,
            responseDelay: parseInt($('#responseDelay').val())
        };

        const msgContainer = $('#create-endpoint-message');
        msgContainer.hide().removeClass('error success');

        $.ajax({
            url: '/api/create-endpoint',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                msgContainer.text('Endpoint created/updated!')
                    .addClass('success')
                    .css('color', 'var(--neon-green)')
                    .show();
                loadEndpoints();
                // Clear form? Maybe not, user might want to tweak.
            },
            error: function (xhr) {
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.error : xhr.responseText;
                msgContainer.text('Error: ' + errorMsg)
                    .addClass('error')
                    .css('color', 'var(--neon-red)')
                    .show();
            }
        });
    });

    // Load Endpoints
    function loadEndpoints() {
        $.ajax({
            url: '/api/admin/list-all-endpoints',
            type: 'GET',
            // No headers needed, cookie is sent automatically
            success: function (response) {
                const endpoints = response.endpoints;
                const container = $('#endpoints-container');
                container.empty();

                // response.endpoints is an object { uniqueKey: [routes...] }
                let hasEndpoints = false;
                for (const [key, routes] of Object.entries(endpoints)) {
                    if (routes.length > 0) hasEndpoints = true;
                    routes.forEach(route => {
                        const card = `
                            <div class="endpoint-card">
                                <h3><span class="method">${route.httpVerb}</span> ${route.endpoint}</h3>
                                <p><strong>Delay:</strong> ${route.responseDelay} ms
                                <strong> | Response Code:</strong> ${route.responseCode}
                                <strong> | Calls:</strong> ${route.callCount}</p>
                                <button class="delete-btn" data-key="${key}" style="width: auto; padding: 5px 10px; font-size: 0.8rem; margin-top: 5px; border-color: var(--neon-pink); color: var(--neon-pink);">Delete All for Key</button>
                            </div>
                         `;
                        container.append(card);
                    });
                }

                if (!hasEndpoints) {
                    container.append('<p>No endpoints found.</p>');
                }

                // Bind delete buttons
                $('.delete-btn').on('click', function () {
                    const key = $(this).data('key');
                    deleteEndpoints(key);

                });
            },
            error: function (xhr) {
                if (xhr.status === 401) {
                    window.location.href = '/';
                }
            }
        });
    }

    function deleteEndpoints(key) {
        $.ajax({
            url: `/api/delete-endpoints/${key}`,
            type: 'DELETE',
            success: function (response) {
                loadEndpoints();
            },
            error: function (xhr) {
                alert('Error deleting endpoints');
            }
        });
    }
});
