<?php
/**
 * Custom Title and Price Header area
 */

defined( 'ABSPATH' ) || exit;
global $product;
?>

<div class="trl-header-area">
	<h1 class="trl-header-title"><?php the_title(); ?></h1>

	<div class="trl-price-container">
		<p class="price"><?php echo $product->get_price_html(); ?></p>
		<span class="trl-taxes-note">Taxes included.</span>
	</div>

	<a href="#" class="trl-size-chart-btn">
		<i class="fa-solid fa-ruler-horizontal"></i> Size chart
	</a>
</div>
