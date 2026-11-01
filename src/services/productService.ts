import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  db,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { Product, NewsletterSubscriber } from '../types';
import { INITIAL_PRODUCTS } from '../data/seedProducts';

const PRODUCTS_COLLECTION = 'products';
const NEWSLETTER_COLLECTION = 'newsletter_subscribers';

/**
 * Fetch all products from Firestore. If Firestore has no documents yet,
 * returns initial seed products.
 */
export async function getProductsFromDb(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) {
      return INITIAL_PRODUCTS;
    }
    const products: Product[] = [];
    snapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
    });
    return products;
  } catch (error) {
    // If permission or network issue before signin, fall back gracefully to seed items
    console.warn('Falling back to local seed products:', error);
    return INITIAL_PRODUCTS;
  }
}

/**
 * Seed initial sample products to Firestore (called once when admin enters or if database is empty)
 */
export async function seedInitialProductsToFirestore(): Promise<void> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) {
      for (const prod of INITIAL_PRODUCTS) {
        const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        const { id, ...data } = prod;
        await setDoc(docRef, data);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}

/**
 * Get single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) };
    }
    // Check seed products as fallback
    const seed = INITIAL_PRODUCTS.find((p) => p.id === id);
    return seed || null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

/**
 * Create a new product in Firestore
 */
export async function createProductInDb(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  const id = product.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const now = new Date().toISOString();
  
  const productData: Omit<Product, 'id'> = {
    ...product,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, productData);
    return { id, ...productData };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

/**
 * Update an existing product in Firestore
 */
export async function updateProductInDb(id: string, updates: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    // remove id if present
    delete (payload as { id?: string }).id;
    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromDb(id: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

/**
 * Subscribe to real-time changes in products collection
 */
export function subscribeToProducts(
  onSuccess: (products: Product[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    productsRef,
    (snapshot) => {
      if (snapshot.empty) {
        onSuccess(INITIAL_PRODUCTS);
        return;
      }
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      onSuccess(products);
    },
    (error) => {
      console.warn('Realtime onSnapshot failed, using static data:', error);
      if (onError) onError(error);
      else onSuccess(INITIAL_PRODUCTS);
    }
  );
}

/**
 * Subscribe email to newsletter
 */
export async function subscribeToNewsletter(email: string, consent: boolean): Promise<boolean> {
  try {
    const id = `sub-${Date.now()}`;
    const docRef = doc(db, NEWSLETTER_COLLECTION, id);
    const record: NewsletterSubscriber = {
      email,
      subscribedAt: new Date().toISOString(),
      consent,
    };
    await setDoc(docRef, record);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, NEWSLETTER_COLLECTION);
  }
}

/**
 * List newsletter subscribers (admin only)
 */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const colRef = collection(db, NEWSLETTER_COLLECTION);
    const snap = await getDocs(colRef);
    const list: NewsletterSubscriber[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<NewsletterSubscriber, 'id'>) });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, NEWSLETTER_COLLECTION);
  }
}
