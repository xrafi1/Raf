<?php
/**
 * Custom template for Touro Royal Layout
 * Overrides: woocommerce/templates/content-single-product.php
 */

defined( 'ABSPATH' ) || exit;

global $product;

/**
 * Hook: woocommerce_before_single_product.
 */
do_action( 'woocommerce_before_single_product' );

if ( post_password_required() ) {
	echo get_the_password_form(); // WPCS: XSS ok.
	return;
}
?>

<div id="product-<?php the_ID(); ?>" <?php wc_product_class( 'touro-layout-wrapper', $product ); ?>>

	<?php
		/**
		 * Hook: woocommerce_before_single_product_summary.
		 * Used for: woocommerce_show_product_images - 20
		 */
		do_action( 'woocommerce_before_single_product_summary' );
	?>

	<div class="summary entry-summary">
		<?php
		/**
		 * Hook: woocommerce_single_product_summary.
		 *
		 * OUR CUSTOMIZED ORDER IN MAIN PLUGIN FILE:
		 * trl_custom_header_area - 5 (Title, Price, Size Chart)
		 * woocommerce_template_single_add_to_cart - 30 (Variations & Cart Buttons)
		 * the_content - 60 (Full description)
		 */
		do_action( 'woocommerce_single_product_summary' );
		?>
	</div>

</div>

<?php do_action( 'woocommerce_after_single_product' ); ?>
