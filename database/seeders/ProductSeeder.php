<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductType;
use App\Models\VolumeDiscount;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create product types
        $seedsType = ProductType::create([
            'name' => 'Seeds',
            'description' => 'Various seeds for farming',
            'slug' => 'seeds',
        ]);

        $fertilizersType = ProductType::create([
            'name' => 'Fertilizers',
            'description' => 'Fertilizers for improving soil and plant growth',
            'slug' => 'fertilizers',
        ]);

        $toolsType = ProductType::create([
            'name' => 'Tools',
            'description' => 'Farming tools and equipment',
            'slug' => 'tools',
        ]);

        // Create seed products
        $seeds = [
            [
                'name' => 'Corn Seeds',
                'description' => 'High-yield hybrid corn seeds for agricultural use',
                'price' => 19.99,
                'sku' => 'SEED-CORN-001',
                'stock_quantity' => 200,
            ],
            [
                'name' => 'Tomato Seeds',
                'description' => 'Disease-resistant tomato seeds for gardens',
                'price' => 9.99,
                'sku' => 'SEED-TOM-001',
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Wheat Seeds',
                'description' => 'Premium quality wheat seeds for large-scale farming',
                'price' => 24.99,
                'sku' => 'SEED-WHT-001',
                'stock_quantity' => 180,
            ],
            [
                'name' => 'Rice Seeds',
                'description' => 'High-yield rice seeds for paddy fields',
                'price' => 22.99,
                'sku' => 'SEED-RCE-001',
                'stock_quantity' => 160,
            ],
            [
                'name' => 'Barley Seeds',
                'description' => 'Quality barley seeds for brewing and animal feed',
                'price' => 18.99,
                'sku' => 'SEED-BRL-001',
                'stock_quantity' => 140,
            ],
            [
                'name' => 'Soybean Seeds',
                'description' => 'Non-GMO soybean seeds for protein-rich crops',
                'price' => 21.99,
                'sku' => 'SEED-SOY-001',
                'stock_quantity' => 130,
            ],
            [
                'name' => 'Oat Seeds',
                'description' => 'Premium oat seeds for healthy grain production',
                'price' => 17.99,
                'sku' => 'SEED-OAT-001',
                'stock_quantity' => 120,
            ],
            [
                'name' => 'Millet Seeds',
                'description' => 'Drought-resistant millet seeds',
                'price' => 15.99,
                'sku' => 'SEED-MIL-001',
                'stock_quantity' => 110,
            ],
            [
                'name' => 'Sorghum Seeds',
                'description' => 'High-yield sorghum seeds for dry regions',
                'price' => 20.99,
                'sku' => 'SEED-SRG-001',
                'stock_quantity' => 100,
            ],
            [
                'name' => 'Rye Seeds',
                'description' => 'Winter-hardy rye seeds for cold climates',
                'price' => 16.99,
                'sku' => 'SEED-RYE-001',
                'stock_quantity' => 90,
            ],
            [
                'name' => 'Quinoa Seeds',
                'description' => 'Organic quinoa seeds for healthy grain production',
                'price' => 25.99,
                'sku' => 'SEED-QUI-001',
                'stock_quantity' => 85,
            ],
            [
                'name' => 'Buckwheat Seeds',
                'description' => 'Gluten-free buckwheat seeds for versatile crops',
                'price' => 18.99,
                'sku' => 'SEED-BUC-001',
                'stock_quantity' => 95,
            ],
            [
                'name' => 'Amaranth Seeds',
                'description' => 'Ancient grain amaranth seeds for nutritious crops',
                'price' => 22.99,
                'sku' => 'SEED-AMA-001',
                'stock_quantity' => 80,
            ],
            [
                'name' => 'Teff Seeds',
                'description' => 'Tiny teff seeds for Ethiopian grain production',
                'price' => 27.99,
                'sku' => 'SEED-TEF-001',
                'stock_quantity' => 75,
            ],
            [
                'name' => 'Sunflower Seeds',
                'description' => 'Large sunflower seeds for oil production',
                'price' => 23.99,
                'sku' => 'SEED-SUN-001',
                'stock_quantity' => 120,
            ],
            [
                'name' => 'Pumpkin Seeds',
                'description' => 'High-yield pumpkin seeds for farming',
                'price' => 21.99,
                'sku' => 'SEED-PUM-001',
                'stock_quantity' => 110,
            ],
            [
                'name' => 'Flax Seeds',
                'description' => 'Organic flax seeds for oil and fiber',
                'price' => 24.99,
                'sku' => 'SEED-FLX-001',
                'stock_quantity' => 95,
            ],
            [
                'name' => 'Hemp Seeds',
                'description' => 'Industrial hemp seeds for fiber production',
                'price' => 29.99,
                'sku' => 'SEED-HMP-001',
                'stock_quantity' => 85,
            ],
            [
                'name' => 'Chia Seeds',
                'description' => 'Nutritious chia seeds for superfood production',
                'price' => 26.99,
                'sku' => 'SEED-CHI-001',
                'stock_quantity' => 90,
            ],
        ];

        // Create fertilizer products
        $fertilizers = [
            [
                'name' => 'NPK Fertilizer',
                'description' => 'Balanced NPK fertilizer for general use',
                'price' => 29.99,
                'sku' => 'FERT-NPK-001',
                'stock_quantity' => 100,
            ],
            [
                'name' => 'Organic Compost',
                'description' => 'Natural organic compost for soil enrichment',
                'price' => 24.99,
                'sku' => 'FERT-ORG-001',
                'stock_quantity' => 80,
            ],
            [
                'name' => 'Urea Fertilizer',
                'description' => 'High-nitrogen urea fertilizer for rapid growth',
                'price' => 27.99,
                'sku' => 'FERT-URE-001',
                'stock_quantity' => 90,
            ],
            [
                'name' => 'Potassium Sulfate',
                'description' => 'Potassium-rich fertilizer for fruit development',
                'price' => 32.99,
                'sku' => 'FERT-POT-001',
                'stock_quantity' => 70,
            ],
            [
                'name' => 'Calcium Nitrate',
                'description' => 'Calcium-rich fertilizer for plant structure',
                'price' => 25.99,
                'sku' => 'FERT-CAL-001',
                'stock_quantity' => 85,
            ],
            [
                'name' => 'Magnesium Sulfate',
                'description' => 'Magnesium supplement for chlorophyll production',
                'price' => 22.99,
                'sku' => 'FERT-MAG-001',
                'stock_quantity' => 75,
            ],
            [
                'name' => 'Bone Meal',
                'description' => 'Natural phosphorus source for root development',
                'price' => 19.99,
                'sku' => 'FERT-BON-001',
                'stock_quantity' => 60,
            ],
            [
                'name' => 'Fish Emulsion',
                'description' => 'Organic nitrogen source from fish waste',
                'price' => 26.99,
                'sku' => 'FERT-FSH-001',
                'stock_quantity' => 65,
            ],
            [
                'name' => 'Seaweed Extract',
                'description' => 'Natural growth stimulant from seaweed',
                'price' => 23.99,
                'sku' => 'FERT-SEA-001',
                'stock_quantity' => 55,
            ],
            [
                'name' => 'Humic Acid',
                'description' => 'Soil conditioner for improved nutrient uptake',
                'price' => 28.99,
                'sku' => 'FERT-HUM-001',
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Azomite',
                'description' => 'Natural mineral fertilizer with trace elements',
                'price' => 34.99,
                'sku' => 'FERT-AZO-001',
                'stock_quantity' => 45,
            ],
            [
                'name' => 'Rock Phosphate',
                'description' => 'Natural phosphorus source for long-term soil health',
                'price' => 29.99,
                'sku' => 'FERT-ROC-001',
                'stock_quantity' => 40,
            ],
            [
                'name' => 'Green Sand',
                'description' => 'Natural potassium and iron source for plants',
                'price' => 21.99,
                'sku' => 'FERT-GRN-001',
                'stock_quantity' => 55,
            ],
            [
                'name' => 'Worm Castings',
                'description' => 'Natural organic fertilizer from earthworms',
                'price' => 19.99,
                'sku' => 'FERT-WRM-001',
                'stock_quantity' => 65,
            ],
            [
                'name' => 'Bat Guano',
                'description' => 'High-phosphorus organic fertilizer',
                'price' => 31.99,
                'sku' => 'FERT-BAT-001',
                'stock_quantity' => 45,
            ],
            [
                'name' => 'Blood Meal',
                'description' => 'High-nitrogen organic fertilizer',
                'price' => 28.99,
                'sku' => 'FERT-BLD-001',
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Kelp Meal',
                'description' => 'Mineral-rich seaweed fertilizer',
                'price' => 25.99,
                'sku' => 'FERT-KLP-001',
                'stock_quantity' => 55,
            ],
            [
                'name' => 'Mycorrhizal Fungi',
                'description' => 'Beneficial fungi for root development',
                'price' => 36.99,
                'sku' => 'FERT-MYC-001',
                'stock_quantity' => 40,
            ],
        ];

        // Create tool products
        $tools = [
            [
                'name' => 'Gardening Shovel',
                'description' => 'Durable steel shovel for gardening',
                'price' => 24.99,
                'sku' => 'TOOL-SHV-001',
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Hoe',
                'description' => 'Sturdy hoe for soil cultivation',
                'price' => 19.99,
                'sku' => 'TOOL-HOE-001',
                'stock_quantity' => 45,
            ],
            [
                'name' => 'Rake',
                'description' => 'Heavy-duty rake for soil leveling',
                'price' => 22.99,
                'sku' => 'TOOL-RAK-001',
                'stock_quantity' => 40,
            ],
            [
                'name' => 'Pruning Shears',
                'description' => 'Sharp pruning shears for plant maintenance',
                'price' => 15.99,
                'sku' => 'TOOL-PRN-001',
                'stock_quantity' => 60,
            ],
            [
                'name' => 'Wheelbarrow',
                'description' => 'Heavy-duty wheelbarrow for material transport',
                'price' => 89.99,
                'sku' => 'TOOL-WBR-001',
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Garden Fork',
                'description' => 'Sturdy garden fork for soil aeration',
                'price' => 27.99,
                'sku' => 'TOOL-FRK-001',
                'stock_quantity' => 35,
            ],
            [
                'name' => 'Watering Can',
                'description' => 'Large capacity watering can for plants',
                'price' => 18.99,
                'sku' => 'TOOL-WTR-001',
                'stock_quantity' => 55,
            ],
            [
                'name' => 'Garden Trowel',
                'description' => 'Ergonomic garden trowel for planting',
                'price' => 12.99,
                'sku' => 'TOOL-TRW-001',
                'stock_quantity' => 70,
            ],
            [
                'name' => 'Hedge Trimmer',
                'description' => 'Electric hedge trimmer for shaping plants',
                'price' => 79.99,
                'sku' => 'TOOL-HDG-001',
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Soil pH Meter',
                'description' => 'Digital soil pH meter for soil testing',
                'price' => 34.99,
                'sku' => 'TOOL-PHM-001',
                'stock_quantity' => 40,
            ],
            [
                'name' => 'Garden Sprayer',
                'description' => 'Pressure sprayer for liquid applications',
                'price' => 45.99,
                'sku' => 'TOOL-SPR-001',
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Garden Gloves',
                'description' => 'Durable gloves for garden work',
                'price' => 14.99,
                'sku' => 'TOOL-GLV-001',
                'stock_quantity' => 100,
            ],
            [
                'name' => 'Garden Kneeler',
                'description' => 'Comfortable kneeler for garden work',
                'price' => 29.99,
                'sku' => 'TOOL-KNL-001',
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Soil Moisture Meter',
                'description' => 'Digital meter for soil moisture monitoring',
                'price' => 39.99,
                'sku' => 'TOOL-MST-001',
                'stock_quantity' => 45,
            ],
            [
                'name' => 'Seed Spreader',
                'description' => 'Manual seed spreader for even distribution',
                'price' => 49.99,
                'sku' => 'TOOL-SPD-001',
                'stock_quantity' => 35,
            ],
            [
                'name' => 'Plant Labels',
                'description' => 'Durable plastic labels for plant identification',
                'price' => 9.99,
                'sku' => 'TOOL-LBL-001',
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Composting Bin',
                'description' => 'Large capacity bin for composting',
                'price' => 79.99,
                'sku' => 'TOOL-CMP-001',
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Irrigation Timer',
                'description' => 'Digital timer for automated watering',
                'price' => 44.99,
                'sku' => 'TOOL-TMR-001',
                'stock_quantity' => 40,
            ],
        ];

        // Create all products
        foreach ($seeds as $seed) {
            $product = Product::create(array_merge($seed, [
                'product_type_id' => $seedsType->id,
                'image_path' => '/storage/products/' . strtolower(str_replace(' ', '-', $seed['name'])) . '.jpg',
            ]));

            // Add volume discounts for seeds
            if (in_array($seed['name'], ['Corn Seeds', 'Wheat Seeds', 'Rice Seeds', 'Quinoa Seeds'])) {
                VolumeDiscount::create([
                    'product_id' => $product->id,
                    'minimum_quantity' => 10,
                    'discount_percentage' => 5.00,
                ]);

                VolumeDiscount::create([
                    'product_id' => $product->id,
                    'minimum_quantity' => 25,
                    'discount_percentage' => 10.00,
                ]);
            }
        }

        foreach ($fertilizers as $fertilizer) {
            $product = Product::create(array_merge($fertilizer, [
                'product_type_id' => $fertilizersType->id,
                'image_path' => '/storage/products/' . strtolower(str_replace(' ', '-', $fertilizer['name'])) . '.jpg',
            ]));

            // Add volume discounts for fertilizers
            if (in_array($fertilizer['name'], ['NPK Fertilizer', 'Organic Compost', 'Urea Fertilizer', 'Azomite'])) {
                VolumeDiscount::create([
                    'product_id' => $product->id,
                    'minimum_quantity' => 5,
                    'discount_percentage' => 8.00,
                ]);

                VolumeDiscount::create([
                    'product_id' => $product->id,
                    'minimum_quantity' => 15,
                    'discount_percentage' => 15.00,
                ]);
            }
        }

        foreach ($tools as $tool) {
            Product::create(array_merge($tool, [
                'product_type_id' => $toolsType->id,
                'image_path' => '/storage/products/' . strtolower(str_replace(' ', '-', $tool['name'])) . '.jpg',
            ]));
        }
    }
}
