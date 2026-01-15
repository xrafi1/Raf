<?php
/*
Plugin Name: Auto Site Delete
Description: Deletes WordPress site data manually by admin action.
Version: 1.0
Author: Your Name
*/

if (!defined('ABSPATH')) {
    exit;
}

// Add menu in admin
add_action('admin_menu', function () {
    add_menu_page(
        'Auto Site Delete',
        'Auto Site Delete',
        'manage_options',
        'auto-site-delete',
        'auto_site_delete_page',
        'dashicons-warning',
        99
    );
});

function auto_site_delete_page() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['delete_site']) && check_admin_referer('auto_site_delete_action')) {
        auto_site_delete_now();
        echo '<div style="padding:15px;background:#d63638;color:#fff;">
        Site data deleted successfully.
        </div>';
    }
    ?>

    <div class="wrap">
        <h1 style="color:red;">Danger Zone</h1>
        <p>This will permanently delete ALL site data.</p>

        <form method="post">
            <?php wp_nonce_field('auto_site_delete_action'); ?>
            <input type="submit" name="delete_site"
                   value="DELETE SITE NOW"
                   style="background:red;color:white;padding:12px 20px;border:none;font-size:16px;cursor:pointer;"
                   onclick="return confirm('Are you absolutely sure? This cannot be undone!');">
        </form>
    </div>

    <?
