import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  addDoc
} from "firebase/firestore";
import { db } from "./config";
import { CompanySettings, Category, Product, Inquiry, ActivityLog } from "@/types";

// Helper: Collection refs
const settingsRef = () => doc(db, "settings", "company");
const categoriesCol = () => collection(db, "categories");
const productsCol = () => collection(db, "products");
const inquiriesCol = () => collection(db, "inquiries");
const activityLogsCol = () => collection(db, "activityLogs");

// --- Settings ---
export async function getCompanySettings(): Promise<CompanySettings | null> {
  try {
    const snap = await getDoc(settingsRef());
    if (snap.exists()) {
      return snap.data() as CompanySettings;
    }
    return null;
  } catch (error) {
    console.error("Error getting settings:", error);
    return null;
  }
}

export async function updateCompanySettings(settings: CompanySettings): Promise<void> {
  await setDoc(settingsRef(), settings);
}

// --- Categories ---
export async function getCategories(onlyEnabled = false): Promise<Category[]> {
  try {
    const q = query(categoriesCol(), orderBy("name", "asc"));
    const snap = await getDocs(q);
    let list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    if (onlyEnabled) {
      list = list.filter(c => c.enabled === true);
    }
    return list;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const q = query(categoriesCol(), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() } as Category;
    }
    return null;
  } catch (error) {
    console.error("Error getting category by slug:", error);
    return null;
  }
}

export async function saveCategory(category: Category): Promise<void> {
  const ref = doc(db, "categories", category.id);
  await setDoc(ref, category);
}

export async function deleteCategory(id: string): Promise<void> {
  const ref = doc(db, "categories", id);
  await deleteDoc(ref);
}

// --- Products ---
export async function getProducts(categoryId?: string, onlyPublished = false): Promise<Product[]> {
  try {
    const q = query(productsCol(), orderBy("name", "asc"));
    const snap = await getDocs(q);
    let list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    if (categoryId) {
      list = list.filter(p => p.categoryId === categoryId);
    }
    if (onlyPublished) {
      list = list.filter(p => p.status === "published");
    }
    return list;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(productsCol(), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error getting product by slug:", error);
    return null;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const ref = doc(db, "products", product.id);
  await setDoc(ref, product);
}

export async function deleteProduct(id: string): Promise<void> {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
}

// --- Inquiries ---
export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const q = query(inquiriesCol(), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
  } catch (error) {
    console.error("Error getting inquiries:", error);
    return [];
  }
}

export async function saveInquiry(inquiry: Omit<Inquiry, "id">): Promise<string> {
  const ref = await addDoc(inquiriesCol(), inquiry);
  return ref.id;
}

export async function updateInquiryStatus(id: string, status: "new" | "read"): Promise<void> {
  const ref = doc(db, "inquiries", id);
  await setDoc(ref, { status }, { merge: true });
}

export async function deleteInquiry(id: string): Promise<void> {
  const ref = doc(db, "inquiries", id);
  await deleteDoc(ref);
}

// --- Activity Logs ---
export async function getActivityLogs(): Promise<ActivityLog[]> {
  try {
    const q = query(activityLogsCol(), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog));
  } catch (error) {
    console.error("Error getting activity logs:", error);
    return [];
  }
}

export async function logActivity(email: string, action: string): Promise<void> {
  const log: Omit<ActivityLog, "id"> = {
    adminEmail: email,
    action,
    timestamp: new Date().toISOString()
  };
  await addDoc(activityLogsCol(), log);
}

// --- Seed Database ---
export async function seedInitialData(force = false): Promise<void> {
  try {
    const currentSettings = await getCompanySettings();
    if (currentSettings && !force) {
      console.log("Database already seeded. Skipping.");
      return;
    }

    console.log("Seeding Database...");

    // 1. Seed settings
    const initialSettings: CompanySettings = {
      name: "RP Foods International",
      phoneNumbers: ["+91 8778522332", "+91 9994524443"],
      email: "rpfoodspowder@gmail.com",
      address: "51B/141, Kumaran Thiru Nagar, Dindigul – 624005, Tamil Nadu, India",
      googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.3644026857134!2d77.965412!3d10.370334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00ab4358bb3c9b%3A0xc3b83ef34d3d81b8!2sDindigul%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      socialLinks: {
        facebook: "https://facebook.com/rpfoodsinternational",
        twitter: "https://twitter.com/rpfoods",
        instagram: "https://instagram.com/rpfoodsinternational",
        linkedin: "https://linkedin.com/company/rp-foods-international"
      },
      hero: {
        title: "Delivering Authentic Indian Spice Excellence Across Global Markets",
        subtitle: "Premium Spice Powders, Masalas, and Culinary Blends Manufactured to International Quality Standards.",
        bgImage: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/banners/spice-hero.jpg"
      },
      about: {
        title: "Pioneering Indian Food Export Since Inception",
        story: "RP Foods International is a premier exporter and manufacturer of high-quality spice powders and masalas based in Dindigul, Tamil Nadu. Committed to delivering the rich heritage of Indian flavors to kitchens worldwide, we maintain rigorous processing quality, authentic taste profiles, and modern hygienic packaging standards to satisfy global expectations.",
        mission: "To process and supply premium, hygienic, and pure spice blends across international borders, establishing Indian agricultural and manufacturing excellence globally.",
        vision: "To become the preferred global partner for authentic Indian spices, trusted by importers, supermarkets, and food services worldwide for consistency, quality, and food safety standards.",
        image: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/banners/about-story.jpg"
      },
      footer: {
        copyright: "© 2026 RP Foods International. All Rights Reserved.",
        text: "Premium Exporter of Pure Spice Powders and Authentic Blends from Tamil Nadu, India."
      },
      seo: {
        metaTitle: "Premium Spice Powders & Masalas Exporter - RP Foods International",
        metaDescription: "RP Foods International is a premium exporter of authentic Indian spice powders, masalas, and blends based in Dindigul, Tamil Nadu. Delivering quality standard spices globally.",
        keywords: "RP Foods, Spice Exporter, Indian Masala, Sambar Powder, Chilli Powder, Turmeric Powder, Curry Powder, Export Masala Dindigul, Tamil Nadu Spices",
        ogImage: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/seo/og-home.jpg",
        googleVerification: ""
      }
    };
    await updateCompanySettings(initialSettings);

    // 2. Seed Categories
    const categories: Category[] = [
      {
        id: "cat_spice_powders",
        name: "Spice Powders",
        slug: "spice-powders",
        description: "Essential single-ingredient spice powders and staple kitchen staples processed from selected premium quality seeds and pods.",
        image: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/categories/spice-powders.jpg",
        enabled: true,
        seo: {
          title: "Premium Spice Powders Supplier & Exporter - RP Foods",
          description: "Explore our range of premium staple spice powders including Turmeric, Chilli, Coriander, Rasam and Sambar Powders.",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "cat_masalas",
        name: "Masalas",
        slug: "masalas",
        description: "Expertly blended aromatic spice mixtures designed to bring authentic taste, convenience, and balance to diverse Indian dishes.",
        image: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/categories/masalas.jpg",
        enabled: true,
        seo: {
          title: "Authentic Indian Blended Masalas - Garam & Biriyani Masala",
          description: "Shop premium blended masalas including Garam Masala and Biriyani Masala crafted with authentic recipes.",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "cat_non_veg_blends",
        name: "Non-Veg Blends",
        slug: "non-veg-blends",
        description: "Robust, spice-rich blends formulated specifically to marinate and cook chicken, mutton, and fish dishes with mouthwatering flavors.",
        image: "https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/categories/non-veg-blends.jpg",
        enabled: true,
        seo: {
          title: "Premium Non-Veg Spice Blends - Chicken, Mutton & Fish Powders",
          description: "Premium chicken curry powder, mutton masala, fish powder, and chicken 65 mixes for global export.",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const cat of categories) {
      await saveCategory(cat);
    }

    // 3. Seed Products
    const products: Product[] = [
      // Spice Powders
      {
        id: "prod_sambar_powder",
        name: "Sambar Powder",
        slug: "sambar-powder",
        categoryId: "cat_spice_powders",
        shortDescription: "A traditional South Indian aromatic spice blend for preparing authentic Lentil-vegetable Sambar.",
        fullDescription: "Sambar is the heart of South Indian cuisine, and our Sambar Powder is formulated with a perfect proportion of coriander seeds, red chillies, fenugreek, cumin, and other premium spices. Slow-roasted to perfection, it releases a rich aroma and ensures a thick, traditional texture for your sambar.",
        specifications: [
          { label: "Origin", value: "Dindigul, Tamil Nadu, India" },
          { label: "Form", value: "Powder" },
          { label: "Color", value: "Reddish Brown" },
          { label: "Shelf Life", value: "12 Months" },
          { label: "Admixtures", value: "None (100% Pure)" }
        ],
        packagingDetails: ["100g Pouch", "250g Pouch", "500g Pouch", "1kg Pouch", "Bulk Carton / PP Bags (as per buyer requirement)"],
        benefits: ["No artificial colors or preservatives", "Authentic South Indian flavor profile", "Rich in dietary fiber and essential oils"],
        applications: ["Preparing Sambar (South Indian lentil soup)", "Flavoring vegetable stir-fries", "Adding to curries for an aromatic spice kick"],
        images: ["https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/sambar-powder.jpg"],
        status: "published",
        seo: {
          title: "Sambar Powder Exporter & Wholesale Exporters - RP Foods",
          description: "Get pure Sambar Powder prepared using premium spices, slow-roasted for rich South Indian aroma. Available for bulk export."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "prod_chilli_powder",
        name: "Chilli Powder",
        slug: "chilli-powder",
        categoryId: "cat_spice_powders",
        shortDescription: "Premium grade hot and vibrant red chilli powder made from hand-picked dry chillies.",
        fullDescription: "Our Chilli Powder is ground from select high-quality red chillies to deliver the perfect blend of natural pungency and deep red color. Cleaned, de-stemmed, and processed in state-of-the-art facilities, it maintains the strict capsicum values required for international food safety standards.",
        specifications: [
          { label: "Pungency", value: "Medium to High" },
          { label: "Color Value", value: "80 - 100 ASTA" },
          { label: "Moisture", value: "Max 9%" },
          { label: "Foreign Matter", value: "Nil" }
        ],
        packagingDetails: ["50g Pouch", "100g Pouch", "500g Pouch", "1kg Pouch", "25kg Multi-layer Paper Bags for Bulk Export"],
        benefits: ["Intense color and hot spicy profile", "Tested for Aflatoxin and Sudan dyes", "Finely milled for smooth dispersion"],
        applications: ["Curries, stews, and soups", "Marinades and spice rubs", "Snacks and savory preparations"],
        images: ["https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/chilli-powder.jpg"],
        status: "published",
        seo: {
          title: "Export Quality Red Chilli Powder Wholesaler - RP Foods",
          description: "High-grade Red Chilli Powder made from selected dry chillies. Certified export quality with high ASTA color value."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "prod_turmeric_powder",
        name: "Turmeric Powder",
        slug: "turmeric-powder",
        categoryId: "cat_spice_powders",
        shortDescription: "Pure ground turmeric with high curcumin content and deep golden yellow color.",
        fullDescription: "Ground from premium quality turmeric fingers sourced directly from Salem and Erode regions. Known for its rich golden color and high curcumin content, our Turmeric Powder acts as a natural food coloring, antioxidant, and flavor enhancer, meeting strict European and US limits for heavy metals and pesticides.",
        specifications: [
          { label: "Curcumin Content", value: "Min 3.0% - 4.5%" },
          { label: "Moisture", value: "Max 8%" },
          { label: "Origin", value: "Tamil Nadu, India" },
          { label: "Total Ash", value: "Max 7%" }
        ],
        packagingDetails: ["100g Pouch", "250g Pouch", "500g Pouch", "1kg Pouch", "25kg PP Bags / Jute Bags"],
        benefits: ["High therapeutic curcumin value", "100% natural, no added lead chromate", "Anti-inflammatory and antimicrobial properties"],
        applications: ["Daily cooking base in curries", "Health drinks and herbal tea", "Cosmetics and traditional skin wellness"],
        images: ["https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/turmeric-powder.jpg"],
        status: "published",
        seo: {
          title: "High Curcumin Turmeric Powder Exporters - RP Foods",
          description: "Bulk export premium golden turmeric powder with verified curcumin content. Handpicked turmeric fingers processed hygienically."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "prod_coriander_powder",
        name: "Coriander Powder",
        slug: "coriander-powder",
        categoryId: "cat_spice_powders",
        shortDescription: "Freshly milled coriander powder offering an earthy, citrusy aroma to culinary dishes.",
        fullDescription: "Milled from clean, fully matured green coriander seeds, our Coriander Powder provides a cooling, sweet, and mild spicy flavor. Essential for building the body and consistency of gravies and curry bases.",
        specifications: [
          { label: "Aroma", value: "Characteristic citrus-woody" },
          { label: "Volatile Oil", value: "Min 0.25%" },
          { label: "Origin", value: "India" }
        ],
        packagingDetails: ["100g Pouch", "500g Pouch", "1kg Pouch", "Bulk Carton Box Packaging"],
        benefits: ["No synthetic flavoring agents", "Retains natural volatile oils", "Excellent thickener for gravies"],
        applications: ["Base thickener for curries and kormas", "Spice mixtures and spice rubs", "Seasoning vegetables"],
        images: ["https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/coriander-powder.jpg"],
        status: "published",
        seo: {
          title: "Wholesale Coriander Powder Exporter - RP Foods International",
          description: "High quality ground coriander powder with high oil content. Direct from Dindigul exporter. Pure and unadulterated."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Masalas
      {
        id: "prod_garam_masala",
        name: "Garam Masala",
        slug: "garam-masala",
        categoryId: "cat_masalas",
        shortDescription: "A rich, highly aromatic blend of premium whole spices to add warmth and depth.",
        fullDescription: "Our Garam Masala is a signature blend of royal spices including cinnamon, cardamom, cloves, mace, star anise, black pepper, and nutmeg. Cleaned, lightly toasted, and pulverized to ensure a strong, uniform warmth in every pinch. Added towards the end of cooking for premium aroma.",
        specifications: [
          { label: "Blend", value: "Multispice (Cardamom, Cloves, Cinnamon, Cumin, Pepper)" },
          { label: "Style", value: "Toasted & Ground" },
          { label: "Purity", value: "100% Pure, No Fillers" }
        ],
        packagingDetails: ["50g Pouch", "100g Pouch", "250g Pouch", "500g Pouch", "Bulk Packings Available"],
        benefits: ["Intense aroma profile", "Small pinch delivers powerful flavor", "Warm and digestive-friendly spices"],
        applications: ["Finishing pinch for Indian curries", "Rice dishes and biriyanis", "Marinades and roasted meats"],
        images: ["https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/garam-masala.jpg"],
        status: "published",
        seo: {
          title: "Authentic Aromatic Garam Masala Export - RP Foods",
          description: "Premium Garam Masala blended with cinnamon, cardamom, cloves, and star anise. Aromatic export quality."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "prod_biriyani_masala",
        name: "Biriyani Masala",
        slug: "biriyani-masala",
        categoryId: "cat_masalas",
        shortDescription: "Exquisite spice blend for crafting authentic, restaurant-style rich Biriyani rice.",
        fullDescription: "Make world-class royal Biriyani with our authentic Biriyani Masala. It contains a perfect ratio of bay leaves, stone flower (kalpasi), star anise, fennel seeds, cloves, and cardamom. This blend captures the heritage taste of Southern and Northern Biriyani cuisines, delivering perfect aroma and taste consistency.",
        specifications: [
          { label: "Ingredients", value: "Kalpasi, Star Anise, Fennel, Cloves, Nutmeg, Cardamom, Chilli, Ginger" },
          { label: "Texture", value: "Coarse Powder" },
          { label: "Gluten Free", value: "Yes" }
        ],
        packagingDetails: ["50g Pouch", "100g Pouch", "200g Pouch", "500g Pouch"],
        benefits: ["Delivers authentic aroma and taste", "Saves prep time, no additional spices needed", "Hygienically milled to protect natural oils"],
        applications: ["Vegetable Biriyani", "Chicken, Mutton, and Egg Biriyanis", "Pulao and flavored ghee rice"],
        images: ["https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/biriyani-masala.jpg"],
        status: "published",
        seo: {
          title: "Biriyani Masala Bulk Supplier & Exporter - RP Foods",
          description: "Spiced blend for Biriyani with stone flower and exotic spices. Bulk options for global markets and food chains."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Non-Veg Blends
      {
        id: "prod_chicken_65_powder",
        name: "Chicken 65 Powder",
        slug: "chicken-65-powder",
        categoryId: "cat_non_veg_blends",
        shortDescription: "A crispy, spicy, and tangy coating mix for making iconic Indian Chicken 65.",
        fullDescription: "Chicken 65 is a legendary Indian appetizer, and our Chicken 65 Powder helps you create it with ease. Formulated with authentic spices, garlic, ginger, and natural red colorings, it creates a crispy, delicious exterior and juicy interior when fried, without needing extra cornflour or seasonings.",
        specifications: [
          { label: "Flavor Profile", value: "Tangy, spicy, and crispy" },
          { label: "Colors", value: "Natural spices (no artificial chemicals)" },
          { label: "Form", value: "Dry Coating Powder" }
        ],
        packagingDetails: ["100g Pouch", "250g Pouch", "500g Pouch", "1kg Pouch"],
        benefits: ["Crispy crunch without excess oil absorption", "Well-balanced spice and salt content", "Perfect marinade consistency"],
        applications: ["Chicken 65, Chicken Majestic, Gobi 65, Paneer 65, Mushroom 65, Fish fry"],
        images: ["https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/chicken-65-powder.jpg"],
        status: "published",
        seo: {
          title: "Chicken 65 Masala Powder Export Supplier - RP Foods",
          description: "Make crispy and spicy Chicken 65 easily with our premium pre-mix. Ideal for restaurants, caterers, and supermarkets."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "prod_chicken_curry_powder",
        name: "Chicken Curry Powder",
        slug: "chicken-curry-powder",
        categoryId: "cat_non_veg_blends",
        shortDescription: "A rich and spicy blend optimized for chicken gravies and poultry preparations.",
        fullDescription: "Specially formulated for chicken curries, our Chicken Curry Powder contains an optimal mix of coriander, chilli, cumin, black pepper, garlic, ginger, and curry leaves. It thickens the gravy and infuses chicken pieces with deep, aromatic masala flavors.",
        specifications: [
          { label: "Blend Type", value: "Poultry Specific Mix" },
          { label: "Taste", value: "Medium-hot spicy" },
          { label: "Shelf Life", value: "12 Months" }
        ],
        packagingDetails: ["100g Pouch", "250g Pouch", "500g Pouch", "1kg Pouch", "Bulk PP Sacks"],
        benefits: ["Deep rich color and hearty aroma", "Standardized recipe for consistency", "Imparts traditional South Indian curry taste"],
        applications: ["Chicken Curry, Chicken Gravy, Chicken Fry, Chicken Sukka, Egg Masalas"],
        images: ["https://res.cloudinary.com/djwogp0es/image/upload/v1717436000/rp-foods/products/chicken-curry-powder.jpg"],
        status: "published",
        seo: {
          title: "Chicken Curry Powder Exporters - RP Foods International",
          description: "High quality Chicken Curry Powder with rich aroma. Export quality spice blends for poultry and gravies."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const prod of products) {
      await saveProduct(prod);
    }

    // 4. Seed default authorized admin
    const adminEmail = "rpfoodspowder@gmail.com";
    const adminRef = doc(db, "admins", adminEmail);
    const adminSnap = await getDoc(adminRef);
    if (!adminSnap.exists()) {
      await setDoc(adminRef, {
        email: adminEmail,
        role: "superadmin",
        createdAt: new Date().toISOString()
      });
      console.log("Seeded default admin authorization: " + adminEmail);
    }

    console.log("Database Seeded Successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

/**
 * Checks if an email is registered as an authorized administrator in Firestore.
 */
export async function isAuthorizedAdmin(email: string): Promise<boolean> {
  try {
    const ref = doc(db, "admins", email.toLowerCase().trim());
    const snap = await getDoc(ref);
    return snap.exists();
  } catch (error) {
    console.error("Error checking admin authorization:", error);
    return false;
  }
}
