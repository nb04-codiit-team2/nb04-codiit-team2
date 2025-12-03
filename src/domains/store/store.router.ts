// import { Router } from 'express';
// import { StoreController } from './store.controller.js';
// import { asyncHandler } from '@/common/middlewares/async.middleware.js';
// import { validate } from '@/common/middlewares/validate.middleware.js';
// import { authenticate, authorize } from '@/common/middlewares/auth.middleware.js';
// import { createStoreSchema, updateStoreSchema, productListQuerySchema } from './store.schema.js';

// const router = Router();
// const storeController = new StoreController();

// POST /api/stores - 스토어 등록 (판매자 전용)
// router.post(
//   '/',
//   authenticate,
//   // authorize('SELLER'),
//   validate(createStoreSchema, 'body'),
//   asyncHandler(storeController.create),
// );

// // GET /api/stores/detail/my - 내 스토어 조회 (판매자 전용)
// router.get(
//   '/detail/my',
//   authenticate,
//   authorize('SELLER'),
//   asyncHandler(storeController.getMyStore),
// );

// // GET /api/stores/detail/my/product - 내 스토어 상품 목록 (판매자 전용)
// router.get(
//   '/detail/my/product',
//   authenticate,
//   authorize('SELLER'),
//   validate(productListQuerySchema, 'query'),
//   asyncHandler(storeController.getMyProducts),
// );

// // GET /api/stores/:storeId - 스토어 상세 조회 (누구나)
// router.get('/:storeId', asyncHandler(storeController.getById));

// // PATCH /api/stores/:storeId - 스토어 수정 (판매자 전용)
// router.patch(
//   '/:storeId',
//   authenticate,
//   authorize('SELLER'),
//   validate(updateStoreSchema),
//   asyncHandler(storeController.update),
// );

// // POST /api/stores/:storeId/favorite - 관심 스토어 등록 (구매자 전용)
// router.post(
//   '/:storeId/favorite',
//   authenticate,
//   authorize('BUYER'),
//   asyncHandler(storeController.addFavorite),
// );

// // DELETE /api/stores/:storeId/favorite - 관심 스토어 해제 (구매자 전용)
// router.delete(
//   '/:storeId/favorite',
//   authenticate,
//   authorize('BUYER'),
//   asyncHandler(storeController.removeFavorite),
// );

// export default router;
