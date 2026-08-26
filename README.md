# AnKura Wonders

Build a complete, premium, modern and fully responsive e-commerce website for the brand:

# BRAND

Brand Name: ANKURA
Sub-brand: by ORGNATURE
Brand positioning: Natural, nutritious, wholesome and traditionally inspired food products.

Primary brand feeling:

* Natural
* Premium
* Healthy
* Trustworthy
* Traditional Indian goodness
* Modern wellness
* Family-friendly

Use the visual identity from the provided product images as the main design reference.

The website must look like a real premium Indian FMCG / healthy-food e-commerce brand, not like a basic template.

Use a sophisticated natural color palette:

* Deep forest green
* Leaf green
* Warm cream / ivory
* Earthy brown
* Muted golden accents

Use elegant serif typography for major brand headings and a clean modern sans-serif font for body text.

Do NOT overuse gold or decorative elements. Keep the design premium, clean and easy to shop.

---

# MOST IMPORTANT FUNCTIONAL REQUIREMENT

# WHATSAPP CHECKOUT

---

THIS IS THE MOST IMPORTANT REQUIREMENT OF THE ENTIRE WEBSITE.

There should be NO traditional online payment gateway checkout.

Do NOT implement:

* Razorpay
* Stripe
* PayPal
* Credit card payment
* UPI payment gateway
* Login requirement
* Mandatory customer account creation

The website must use a WhatsApp-based ordering system.

WhatsApp business number:

+91 94491 50477

WhatsApp link:
https://wa.me/919449150477

The customer must be able to:

1. Browse products
2. Open product details
3. Select quantity
4. Add products to cart
5. Continue shopping
6. Open cart
7. Edit quantities
8. Remove products
9. See subtotal
10. Enter customer/order details
11. Click "ORDER ON WHATSAPP"
12. Automatically open WhatsApp
13. Pre-fill a complete order message containing the customer's cart and details.

---

# WHATSAPP ORDER FLOW

---

Implement the complete WhatsApp checkout flow.

Example:

Customer adds:

AnKura Cold Pressed Groundnut Oil 1L × 2
AnKura Multi Millet Health Mix 500g × 1
AnKura Ancient Herbs Tea × 1

Cart total: ₹XXX

Customer enters:

Name:
Mobile Number:
Delivery Address:
City:
Pincode:
Optional Order Note:

When the customer clicks:

"ORDER ON WHATSAPP"

Generate a properly URL-encoded WhatsApp message.

Example WhatsApp message format:

Hello AnKura by Orgnature,

I would like to place an order.

## ORDER DETAILS

Product: Cold Pressed Groundnut Oil 1L
Qty: 2
Price: ₹XXX
Subtotal: ₹XXX

Product: Multi Millet Health Mix 500g
Qty: 1
Price: ₹XXX
Subtotal: ₹XXX

Product: Ancient Herbs Herbal Tea
Qty: 1
Price: ₹XXX
Subtotal: ₹XXX
--------------

SUBTOTAL: ₹XXX
DELIVERY: To be confirmed
TOTAL: ₹XXX

CUSTOMER DETAILS
Name: XXXXX
Mobile: XXXXX
Address: XXXXX
City: XXXXX
Pincode: XXXXX

Order Note:
XXXXX

Please confirm my order and delivery charges.

Thank you.

The WhatsApp URL should be dynamically generated using:

https://wa.me/919449150477?text=ENCODED_MESSAGE

Use JavaScript's encodeURIComponent() or an equivalent safe URL encoding method.

The WhatsApp button must work correctly on:

* Desktop WhatsApp Web
* Android WhatsApp
* iPhone WhatsApp

---

# CART SYSTEM

---

Build a real functional shopping cart.

The cart must support:

* Add to cart
* Remove from cart
* Increase quantity
* Decrease quantity
* Direct quantity input
* Cart item subtotal
* Complete cart subtotal
* Empty cart
* Continue shopping
* Cart drawer on desktop
* Cart page on mobile
* Persistent cart using localStorage

If the customer refreshes the page, the cart should remain.

Show cart count in the header.

Example:

Cart icon
3 items

When the cart is empty:

"Your cart is waiting for something natural."

Button:

"Explore Products"

When products are added, show:

Product image
Product name
Pack size
Price
Quantity selector
Item subtotal
Remove icon

At the bottom:

Subtotal
Delivery: To be confirmed
Total

Large button:

"ORDER ON WHATSAPP"

---

# CHECKOUT / CUSTOMER DETAILS

---

Do not create a conventional payment checkout.

Instead create a simple "Order Details" section before WhatsApp.

Fields:

Full Name *
Mobile Number *
Delivery Address *
City *
State
Pincode *
Order Notes

Optional:

Preferred delivery time

Add clear validation.

For mobile number:

* Accept Indian mobile numbers
* Validate 10-digit Indian mobile number
* Display helpful error if invalid.

For pincode:

* Validate 6 digits.

The customer should NOT be required to create an account.

The customer should NOT have to enter card or payment information.

At the bottom display:

"Your order will be sent to WhatsApp for confirmation."

Then:

[ ORDER ON WHATSAPP ]

After clicking:

* Generate message
* Open WhatsApp
* Preserve order information
* Show a small success notification on the website before/after redirect when possible.

---

# DELIVERY CHARGES

---

Do not hard-code delivery charges unless they are provided later.

Initially show:

Delivery: To be confirmed

In the admin/product configuration, make shipping charges easy to change later.

Structure the code so the business owner can later add:

* Free shipping above a certain amount
* Flat delivery charge
* Pincode-based delivery
* City-based delivery

But do NOT add unnecessary complexity in the first version.

---

# WEBSITE STRUCTURE

---

Create the following pages:

1. HOME
2. SHOP
3. PRODUCT DETAILS
4. CATEGORY
5. CART
6. ORDER ON WHATSAPP / CHECKOUT
7. ABOUT US
8. CONTACT US
9. FAQ
10. PRIVACY POLICY
11. SHIPPING & DELIVERY
12. TERMS & CONDITIONS

Footer should contain all necessary navigation links.

---

# HEADER

---

Create a premium sticky header.

Desktop:

Left:
ANKURA logo

Center navigation:

Home
Shop
Categories
About Us
Contact

Right:
Search
Cart icon
WhatsApp order shortcut

Mobile:

Logo
Search
Cart
Hamburger menu

Header should remain clean and compact.

Cart icon should display live item count.

Add a floating WhatsApp button on mobile and desktop.

Floating WhatsApp button:

* WhatsApp icon
* "Chat with us"
* Opens WhatsApp
* Number: +91 94491 50477

---

# HOME PAGE

---

Create a premium conversion-focused homepage.

SECTION 1 — HERO

Large premium hero banner.

Headline:

"Nature's Goodness. Delivered with Trust."

Alternative supporting line:

"Wholesome, natural and thoughtfully crafted products for everyday wellness."

Buttons:

"SHOP NOW"

"ORDER ON WHATSAPP"

Hero visual direction:
Use the supplied AnKura / Orgnature product imagery as the visual reference.

Use products such as:

* Cold pressed oils
* Millet products
* Health mixes
* Herbal teas
* Spices
* Flours

The hero should immediately communicate:
Natural + Premium + Indian + Healthy.

---

## SECTION 2 — TRUST BADGES

Create a clean icon section:

100% Natural
No Added Preservatives
Carefully Sourced
Hygienically Processed
Trusted Quality

Use simple premium line icons.

---

## SECTION 3 — SHOP BY CATEGORY

Create visually appealing category cards.

Categories:

Cold Pressed Oils
Millet Products
Health Mixes
Herbal Teas
Spices & Masalas
Flours & Atta
Noodles & Pasta
Baby & Kids Nutrition
Ghee & Traditional Foods
Snacks & Nuts
Combos & Value Packs
Traditional Drinks

Each category should be clickable.

Use the supplied product/category imagery wherever possible.

---

## SECTION 4 — FEATURED PRODUCTS

Display a premium product grid.

Each product card must contain:

Product image
Product name
Short description
Pack size
MRP
Selling price if applicable
Discount badge if applicable
Add to Cart button
Quick View button

Example:

ANkura Cold Pressed Groundnut Oil
1 Litre

₹XXXX

[ADD TO CART]

Do NOT fabricate prices.

Where exact prices are not available, make the price data editable from a centralized product data file.

---

## SECTION 5 — WHY CHOOSE ANKURA

Create a premium section based on the supplied company/product materials.

Use:

100% Natural Ingredients
Carefully Sourced
Hygienically Processed
Trusted by Families
Goodness in Every Bite

Include a short brand paragraph.

Example tone:

"At AnKura by Orgnature, we believe everyday food should be wholesome, honest and thoughtfully made. We combine traditional food wisdom with careful sourcing and modern hygienic processing to bring natural goodness to everyday living."

Do not make unsupported medical claims.

---

## SECTION 6 — BEST SELLERS

Create a horizontal product showcase.

Suggested products:

Cold Pressed Groundnut Oil
Multi Millet Health Mix
Ancient Herbs Herbal Tea
Multi Millet Noodles
Multi Millet Pasta
Pure Cow Ghee
Sprouted Ragi Baby Cereal

Each product has:

View Product
Add to Cart

---

## SECTION 7 — HEALTH & WELLNESS COLLECTION

Create a premium section promoting:

Health Mixes
Herbal Teas
Millet Products
Natural Snacks
Traditional Drinks

Use large lifestyle imagery.

---

## SECTION 8 — COMBOS

Create a "Combos & Value Added Products" section.

Show bundles such as:

Healthy Breakfast Combo
Millet Wellness Combo
Family Wellness Combo
Natural Cooking Essentials
Tea & Wellness Combo

Allow each combo to be added to cart like a normal product.

---

## SECTION 9 — BRAND STORY

Create an "About AnKura" section.

Use content inspired by the supplied material:

AnKura by Orgnature is built around natural ingredients, traditional goodness, careful sourcing and thoughtful processing.

Focus on:

Quality
Health & Wellness
Sustainability
Transparency
Community

Use premium imagery of grains, herbs, farms, natural ingredients and traditional food preparation.

---

## SECTION 10 — CTA

Create a large conversion section:

"Bring Nature's Goodness Home."

Supporting text:

"Explore wholesome everyday foods made for you and your family."

Buttons:

SHOP ALL PRODUCTS
ORDER ON WHATSAPP

---

# SHOP PAGE

---

Create a professional e-commerce shop page.

Layout:

Desktop:
Sidebar filters + Product grid

Mobile:
Filter button + Product grid

Filters:

Category
Price
Pack Size
Availability
Product Type

Sort by:

Featured
Newest
Price — Low to High
Price — High to Low
Best Selling

Add search functionality.

Search should work for:

* Product names
* Categories
* Keywords
* Ingredients

Example:
Searching "millet" should display all relevant millet products.

---

# PRODUCT DETAIL PAGE

---

Create a premium product detail page.

Layout:

Left:
Large image gallery

Right:
Product name
Short description
Price
Pack size
Availability
Quantity selector
Add to Cart
Order on WhatsApp

Below:

Description
Ingredients
Nutritional Information
Benefits
How to Use / Preparation
Storage
Allergen Information
Additional Details

Only display information actually available for the product.

Do not invent nutritional values or health claims.

Use data structure so these details can easily be edited later.

Add:

"Need help before ordering?"

WhatsApp button:

"CHAT ON WHATSAPP"

---

# PRODUCT DATA

---

Create the product catalog as structured data so products can be easily added or edited.

Recommended structure:

id
name
slug
category
subcategory
description
shortDescription
price
mrp
discount
packSize
images
ingredients
nutrition
benefits
preparation
storage
allergens
featured
bestSeller
available
tags

Use the supplied product images as the primary visual reference.

Products visible in the supplied materials include, among others:

COLD PRESSED OILS

* Cold Pressed Groundnut Oil
* Cold Pressed Sesame Oil
* Cold Pressed Coconut Oil
* Cold Pressed Sunflower Oil
* Cold Pressed Mustard Oil

MILLET PRODUCTS

* Multi Millet Health Mix
* Millet Health Booster
* Multi Millet Pasta
* Multi Millet Noodles
* High Protein Chilla Mix

BABY / KIDS

* Sprouted Ragi Baby Cereal

HERBAL / WELLNESS

* Ancient Herbs Herbal Tea
* Herbal Wellness Drink Pulp

TRADITIONAL PRODUCTS

* Pure Cow Ghee
* Wood Apple Refreshing Drink Mix

FLOURS

* Wheat Atta
* Multigrain Atta
* Jowar Atta
* Ragi Atta
* Bajra Atta
* Besan Atta
* Kuttu Flour
* Rice Atta
* Black Channa Atta
* Broken Wheat
* Idli Rawa
* Other available flour varieties shown in the supplied materials

SPICES

* Chilli Powder
* Turmeric Powder
* Coriander Powder
* Cumin Powder
* Garam Masala
* Custom Spice Blends

SNACKS / HEALTH PRODUCTS

* Mixed Nuts
* Seeds
* Health Mixes
* Natural Snacks

COMBOS

* Value Added Products
* Wellness Combos
* Family Combos

Important:
Do not invent products that are not provided.
Do not invent prices.
Do not invent nutrition information.

Where information is missing, create editable placeholder data and clearly structure it so I can update it later.

---

# PRODUCT IMAGE SYSTEM

---

The provided product images should be used as the primary visual reference.

Do not create random unrelated product images.

For every product:

Main image
Secondary image
Optional lifestyle image

Use:

* Object-fit contain for package images
* High-quality image display
* Rounded corners
* Subtle shadow

Product images should look premium and consistent.

---

# CATEGORY PAGE

---

Every category should have:

Category banner
Category description
Product count
Filters
Product grid
Sort function

Example:

COLD PRESSED OILS

"Pure oils crafted with traditional extraction methods for everyday cooking."

Then show all relevant oils.

---

# SEARCH

---

Add an instant search interface.

When user clicks search:

Show large search field.

Search results should update dynamically.

Show:

"Search results for: millet"

Allow clearing search.

On mobile, search should be easy to access from the header.

---

# MOBILE EXPERIENCE

---

The website must be extremely mobile friendly because a large percentage of customers may arrive through WhatsApp, Instagram and Facebook.

Mobile requirements:

* Sticky mobile header
* Bottom cart/order bar where appropriate
* Large buttons
* Easy quantity selectors
* Swipeable image galleries
* Mobile filter drawer
* Fast-loading product cards
* WhatsApp floating button
* No horizontal scrolling
* Proper spacing
* Readable text
* Touch-friendly controls

The WhatsApp ordering experience should be especially smooth on mobile.

---

# WHATSAPP BUTTONS

---

Use WhatsApp buttons throughout the website.

Primary:

ORDER ON WHATSAPP

Secondary:

CHAT WITH US

Product page:

ORDER THIS PRODUCT ON WHATSAPP

Cart:

ORDER CART ON WHATSAPP

Contact page:

CHAT WITH ANKURA

When ordering a single product directly from a product page, generate a WhatsApp message containing:

Product
Quantity
Price
Pack size

Then ask the customer to provide:

Name
Address
Phone number

For cart checkout, send the entire cart.

---

# CART WHATSAPP MESSAGE LOGIC

---

Create a reusable function such as:

generateWhatsAppOrderMessage()

The function should:

1. Read cart items
2. Read product names
3. Read quantities
4. Read prices
5. Calculate subtotals
6. Calculate cart subtotal
7. Read customer details
8. Build formatted message
9. URL encode message
10. Open WhatsApp

Never manually construct a static message.

The message must always reflect the customer's current cart.

Example logic:

cartItems.map(item => {
product.name
item.quantity
product.price
})

Calculate:

itemTotal = price × quantity

cartTotal = sum(itemTotal)

---

# ORDER REFERENCE

---

Generate a simple client-side order reference before opening WhatsApp.

Example:

ANK-20260821-4832

Include it in the WhatsApp message:

Order Reference: ANK-20260821-4832

This is useful for the business to identify orders.

---

# ORDER SUCCESS EXPERIENCE

---

After WhatsApp opens, show a confirmation state where possible:

"Your order request has been prepared for WhatsApp."

"Please send the message in WhatsApp to complete your order."

Display:

Order Reference

Important:
Do not say "Payment Successful".
Do not say "Order Confirmed" until the business confirms it.

Use wording such as:

"Order Request Ready"

---

# ABOUT PAGE

---

Create a professional About page for:

ANKURA by ORGNATURE

Sections:

Our Story
Our Vision
Our Mission
Our Commitment
Why Choose Us

Use visual language from the supplied company presentation images.

Vision:

"To be a global leader in natural and wholesome products, inspiring healthier lives and a more sustainable tomorrow."

Mission:

"To deliver wholesome, natural and premium-quality products by combining traditional wisdom with modern technology, ensuring purity, taste and nutrition."

Commitments:

Quality First
Health & Wellness
Sustainability
Transparency
Community

---

# CONTACT PAGE

---

Display:

ANKURA by ORGNATURE

Phone:
+91 94491 50477

Additional phone if required:
+91 93903 33077

Website:
[www.orgnature.in](http://www.orgnature.in)

Email:
[orgnature3@gmail.com](mailto:orgnature3@gmail.com)

Address:
Use the address shown in the supplied company materials where appropriate, but keep the address editable in the site's configuration.

Add:

WhatsApp
Phone
Email
Google Maps placeholder / map section

---

# FOOTER

---

Footer sections:

Shop
Categories
About
Customer Support
Policies
Contact

Include:

WhatsApp
Phone
Email
Website
Social media icons

Bottom:

"© AnKura by Orgnature. All Rights Reserved."

---

# ADMIN / EASY EDITING

---

IMPORTANT:

Build the project so that product information is easy to edit.

Keep product catalog data centralized.

Do not hard-code product information across multiple components.

Create a clean product data file or database structure.

I should be able to easily change:

Product name
Price
MRP
Discount
Image
Description
Category
Pack size
Ingredients
Nutrition
Stock status
Featured status

without redesigning the website.

---

# DESIGN REQUIREMENTS

---

Design language:

Premium Indian natural FMCG brand.

Use:

Cream backgrounds
Forest green
Earthy brown
Natural gold accents
Leaf illustrations
Elegant cards
Rounded corners
Soft shadows
High-quality food photography

Avoid:

Cheap-looking gradients
Neon colors
Excessive animations
Overly colorful UI
Generic startup illustrations
Unrelated stock photos
Cluttered layouts

Animations should be subtle:

* Fade-in
* Smooth hover
* Product card lift
* Soft image zoom
* Cart animation
* Button feedback

Do not make animations slow enough to hurt shopping.

---

# PERFORMANCE

---

Optimize the website for speed.

Use:

* Lazy loading for product images
* Responsive image sizing
* Modern image formats where possible
* Minimal unnecessary JavaScript
* Clean component structure

The home page should load quickly on mobile.

---

# SEO

---

Add proper:

Page titles
Meta descriptions
Open Graph tags
Product structured data where appropriate
Category URLs
Product URLs
Alt text for images
Semantic HTML

Example title:

"AnKura by Orgnature | Natural & Wholesome Foods"

Example product title:

"Cold Pressed Groundnut Oil | AnKura by Orgnature"

---

# ACCESSIBILITY

---

Ensure:

Good contrast
Readable font sizes
Keyboard navigation
Accessible buttons
Alt text
ARIA labels where needed
Visible focus states

---

# TECHNICAL REQUIREMENTS

---

Build using a modern maintainable frontend architecture.

Preferred:

React
TypeScript
Tailwind CSS

Use reusable components.

Suggested components:

Header
Footer
HeroSection
CategoryCard
ProductCard
ProductGrid
ProductDetails
QuantitySelector
CartDrawer
CartPage
CheckoutForm
WhatsAppOrderButton
SearchBar
FilterPanel
ProductGallery
TrustBadges
Testimonials
ComboSection
FloatingWhatsAppButton

Use clean component separation.

---

# STATE MANAGEMENT

---

Cart state must work globally across:

Home
Shop
Category
Product Details
Cart

Use React state/context or another lightweight solution.

Persist cart using localStorage.

---

# IMPORTANT SECURITY / VALIDATION

---

Validate customer input before opening WhatsApp.

Do not expose secret API keys.

Do not create fake backend credentials.

The WhatsApp checkout does not require an API.

Use a normal WhatsApp click-to-chat URL.

---

# NO PAYMENT GATEWAY

---

Again, this is critical.

Do NOT build a payment gateway.

The website is:

BROWSE → ADD TO CART → CUSTOMER DETAILS → WHATSAPP

The business will communicate with the customer through WhatsApp and handle payment/order confirmation separately.

---

# ORDER BUTTON BEHAVIOUR

---

Use clear button text everywhere.

Primary:

ORDER ON WHATSAPP

Alternative:

SEND ORDER TO WHATSAPP

Single product:

ORDER THIS PRODUCT

Cart:

SEND CART TO WHATSAPP

Avoid generic buttons such as:

"Checkout"

because this is not a normal payment checkout.

---

# EMPTY CART

---

Design an attractive empty cart state.

Text:

"Your cart is empty."

Supporting text:

"Discover wholesome products for your everyday kitchen and wellness."

Button:

"SHOP PRODUCTS"

---

# ERROR HANDLING

---

If cart is empty and customer presses order:

Show:

"Please add at least one product to your cart before ordering."

If required customer details are missing:

Highlight the missing field.

Example:

"Please enter your delivery address."

Do not redirect to WhatsApp until required information is valid.

---

# IMPORTANT PRODUCT CONTENT RULE

---

The supplied product packaging contains product-specific information.

Use that information only where clearly readable.

Do NOT invent:

* Medical claims
* Nutrition values
* Certifications
* Ingredients
* Prices
* Product benefits
* Manufacturing information

Where uncertain, leave the information editable or omit it.

Especially avoid making medical or disease-treatment claims.

---

# FINAL USER EXPERIENCE

---

The complete customer journey should feel like this:

HOME
↓
SHOP
↓
CATEGORY
↓
PRODUCT
↓
ADD TO CART
↓
CONTINUE SHOPPING
↓
CART
↓
CUSTOMER DETAILS
↓
ORDER ON WHATSAPP
↓
WHATSAPP OPENS
↓
PRE-FILLED ORDER MESSAGE
↓
CUSTOMER SENDS MESSAGE
↓
BUSINESS CONFIRMS ORDER

---

# FINAL QUALITY CHECK

---

Before completing the project, test all of the following:

1. Add one product to cart
2. Add multiple different products
3. Increase quantity
4. Decrease quantity
5. Remove item
6. Refresh page and confirm cart persists
7. Open cart
8. Enter customer details
9. Validate phone number
10. Validate pincode
11. Click Order on WhatsApp
12. Confirm WhatsApp opens
13. Confirm all cart products appear
14. Confirm quantities are correct
15. Confirm prices are correct
16. Confirm subtotal is correct
17. Confirm customer details appear
18. Confirm order reference appears
19. Test mobile layout
20. Test desktop layout
21. Test direct product WhatsApp button
22. Test empty cart handling
23. Test search
24. Test category filtering
25. Test product sorting

MOST IMPORTANT:

The WhatsApp order message must always match the customer's actual cart.

Do not create a fake checkout flow.

The final website should look and behave like a premium real e-commerce website, with WhatsApp acting as the final order channel. also i need full build admin panel with all products adding website images changing logo changing options

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c85e570a-5afb-4b35-877a-f5bd7a83daa1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
