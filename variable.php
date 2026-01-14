<?php
/**
 * Custom Variable Product Add to Cart
 * Overrides: woocommerce/templates/single-product/add-to-cart/variable.php
 * Goal: Output radio buttons instead of selects for easier styling as swatches.
 */

defined( 'ABSPATH' ) || exit;

global $product;

$attribute_keys = array_keys( $attributes );
$variations_json = wp_json_encode( $available_variations );
$variations_attr = function_exists( 'wc_esc_json' ) ? wc_esc_json( $variations_json ) : _wp_specialchars( $variations_json, ENT_QUOTES, 'UTF-8', true );

do_action( 'woocommerce_before_add_to_cart_form' ); ?>

<form class="variations_form cart" action="<?php echo esc_url( apply_filters( 'woocommerce_add_to_cart_form_action', $product->get_permalink() ) ); ?>" method="post" enctype='multipart/form-data' data-product_id="<?php echo absint( $product->get_id() ); ?>" data-product_variations="<?php echo $variations_attr; // WPCS: XSS ok. ?>">
	<?php do_action( 'woocommerce_before_variations_form' ); ?>

	<?php if ( empty( $available_variations ) && false !== $available_variations ) : ?>
		<p class="stock out-of-stock"><?php echo esc_html( apply_filters( 'woocommerce_out_of_stock_message', __( 'This product is currently out of stock and unavailable.', 'woocommerce' ) ) ); ?></p>
	<?php else : ?>
		<table class="variations" cellspacing="0" role="presentation">
			<tbody>
				<?php foreach ( $attributes as $attribute_name => $options ) : ?>
					<tr data-attribute_name="attribute_<?php echo esc_attr( sanitize_title( $attribute_name ) ); ?>">
						<td class="label"><label><?php echo wc_attribute_label( $attribute_name ); // WPCS: XSS ok. ?> <span class="selected-label-name"></span></label></td>
						<td class="value">
							<?php
							// CUSTOM: Force Radio Buttons display
							$selected = isset( $_REQUEST[ 'attribute_' . sanitize_title( $attribute_name ) ] ) ? wc_clean( stripslashes( urldecode( $_REQUEST[ 'attribute_' . sanitize_title( $attribute_name ) ] ) ) ) : $product->get_variation_default_attribute( $attribute_name );
							
							echo '<div class="trl-radio-swatches">';
							if ( isset( $attributes[ $attribute_name ] ) ) {
								foreach ( $attributes[ $attribute_name ] as $option ) {
									$checked = sanitized_text_field( $selected ) === $option ? 'checked="checked"' : '';
									$id      = esc_attr( sanitize_title( $attribute_name ) . '-' . sanitize_title( $option ) );
									echo '<input type="radio" id="' . $id . '" name="attribute_' . esc_attr( sanitize_title( $attribute_name ) ) . '" value="' . esc_attr( $option ) . '" ' . $checked . ' data-attribute_name="attribute_' . esc_attr( sanitize_title( $attribute_name ) ) . '" />';
									echo '<label for="' . $id . '">' . esc_html( apply_filters( 'woocommerce_variation_option_name', $option, null, $attribute_name, $product ) ) . '</label>';
								}
							}
							echo '</div>';
							?>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
		<?php do_action( 'woocommerce_after_variations_table' ); ?>

		<div class="single_variation_wrap">
			<?php
				/**
				 * Hook: woocommerce_before_single_variation.
				 */
				do_action( 'woocommerce_before_single_variation' );

				/**
				 * Hook: woocommerce_single_variation. Used to output the cart button and placeholder for variation data.
				 * @hooked woocommerce_single_variation - 10
				 * @hooked woocommerce_single_variation_add_to_cart_button - 20
				 */
				do_action( 'woocommerce_single_variation' );

				/**
				 * Hook: woocommerce_after_single_variation.
				 */
				do_action( 'woocommerce_after_single_variation' );
			?>
			<button type="button" class="trl-fake-buy-now">Buy it now</button>
		</div>
	<?php endif; ?>

	<?php do_action( 'woocommerce_after_variations_form' ); ?>
</form>

<?php
do_action( 'woocommerce_after_add_to_cart_form' );
