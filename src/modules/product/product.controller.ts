import { Request, Response } from 'express';
import { ProductService } from './product.service';

const productService = new ProductService();

export class ProductController {
  async createProduct(req: Request, res: Response) {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const product = await productService.createProduct({ ...req.body, sellerId });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create product' });
    }
  }

  async getProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const product = await productService.getProductById(id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Failed to get product' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const product = await productService.updateProduct(id, req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update product' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      await productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete product' });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const products = await productService.getAllProducts(page, limit);
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get products' });
    }
  }

  async searchProducts(req: Request, res: Response) {
    const { query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const products = await productService.searchProducts(query as string, page, limit);
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: 'Failed to search products' });
    }
  }

  async getSellerProducts(req: Request, res: Response) {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const products = await productService.getSellerProducts(sellerId, page, limit);
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get seller products' });
    }
  }

  async updateProductStock(req: Request, res: Response) {
    const { id } = req.params;
    const { stock } = req.body;
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const product = await productService.updateProductStock(id, stock);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update product stock' });
    }
  }

  async createProductVariant(req: Request, res: Response) {
    const { productId } = req.params;
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const product = await productService.createProductVariant(productId, req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create product variant' });
    }
  }

  async updateProductVariant(req: Request, res: Response) {
    const { variantId } = req.params;
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const product = await productService.updateProductVariant(variantId, req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update product variant' });
    }
  }

  async deleteProductVariant(req: Request, res: Response) {
    const { variantId } = req.params;
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      await productService.deleteProductVariant(variantId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete product variant' });
    }
  }
}

