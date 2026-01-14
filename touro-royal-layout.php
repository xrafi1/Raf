<?php
/**
 * Plugin Name: Touro Royal Product Layout
 * Description: Instantly transforms WooCommerce single product pages to match the specific "Touro Royal Tee" design.
 * Version: 1.0
 * Author: AI Designer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// 1. Enqueue Custom CSS for the single product page
function trl_enqueue_styles() {
	if ( is_product() ) {
		wp_enqueue_style( 'trl-custom-style', plugin_dir_url( __FILE__ ) . 'assets/style.css', array(), '1.0.0' );
		// Load Font Awesome for icons (cart, size chart)
		wp_enqueue_style( 'font-awesome-cdn', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' );
	}
}
add_action( 'wp_enqueue_scripts', 'trl_enqueue_styles' );

// 2. Tell WooCommerce to look for templates in this plugin folder
function trl_woocommerce_locate_template( $template, $template_name, $template_path ) {
	global $woocommerce;

	$_template = template_path();

	if ( ! $template_path ) {
		$template_path = $woocommerce->template_url;
	}

	$plugin_path = untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/woocommerce/';

	// Look within plugin/woocommerce/ folder
	$template = locate_template(
		array(
			$template_path . $template_name,
			$template_name,
		)
	);

	// If template doesn't exist in theme, use the plugin template file
	if ( ! $template && file_exists( $plugin_path . $template_name ) ) {
		$template = $plugin_path . $template_name;
	}

	return $template;
}
add_filter( 'woocommerce_locate_template', 'trl_woocommerce_locate_template', 10, 3 );


// 3. Custom hooks to rearrange elements to match design

// Remove default tabs and hook description directly
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs', 10 );
add_action( 'woocommerce_single_product_summary', 'the_content', 60 ); // Place description at the bottom of summary

// Remove default title/price hooks as we are replacing them with custom template parts
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );

// Add custom combined Title/Price/Size Chart header
add_action( 'woocommerce_single_product_summary', 'trl_custom_header_area', 5 );

function trl_custom_header_area() {
	wc_get_template( 'single-product/title.php' );
}
