const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/groupController.js');

/**
 * @swagger
 *  /group:
 *    get:
 *      tags:
 *        - group
 *      summary: 그룹 조회
 *      parameters:
 *        - in: query
 *          name: query
 *          schema: 
 *            type: string
 *        - in: cookie
 *          name: JWT Token
 *          schema:
 *           type: string
 *          required: true
 *      responses:
 *        200:
 *          description: 그룹 조회 성공
 *        401:
 *          description: 인증 실패
 *        404:
 *          description: Not Found
 *        500:
 *          description: Interner Server Error
 */
router.get('', groupController.search);

/**
 * @swagger
 *  /group:
 *    post:
 *      tags:
 *        - group
 *      summary: 그룹 생성 요청
 *      parameters:
 *        - in: cookie
 *          name: JWT Token
 *          schema:
 *           type: string
 *          required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                path:
 *                  type: string
 *                admins:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: user._id
 *                inspectors:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: user._id
 *              required:
 *                - name
 *                - path
 *            example: 
 *              name: backend
 *              path: ,handover,backend,
 *              admins: ["0123knlxzcv234", "13204aklsdnf"]
 *              inspectors: ["1234kln123kas"]
 *      responses:
 *        201:
 *          description: 그룹 생성 성공
 *        401: 
 *          description: 인증 실패
 *        404:
 *          description: Not Found
 *        500:
 *          description: Interner Server Error
 */
router.post('', groupController.create);

/**
 * @swagger
 *  /group:
 *    put:
 *      tags:
 *        - group
 *      summary: 그룹 정보 갱신 요청
 *      parameters:
 *        - in: cookie
 *          name: JWT Token
 *          schema:
 *           type: string
 *          required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                path:
 *                  type: string
 *                admins:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: user._id
 *                inspectors:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: user._id
 *              required:
 *                - name
 *                - path
 *            example: 
 *              name: backend
 *              path: ,handover,backend,
 *              admins: ["0123knlxzcv234", "13204aklsdnf"]
 *              inspectors: ["1234kln123kas"]
 *      responses:
 *        204:
 *          description: 그룹 정보 갱신 성공
 *        401: 
 *          description: 인증 실패
 *        404:
 *          description: Not Found
 *        500:
 *          description: Interner Server Error
 */
router.put('', groupController.update);

/**
 * @swagger
 *  /group:
 *    delete:
 *      tags:
 *        - group
 *      summary: 그룹 삭제 요청
 *      parameters:
 *        - in: cookie
 *          name: JWT Token
 *          schema:
 *           type: string
 *          required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                path:
 *                  type: string
 *              required:
 *                - name
 *                - path
 *            example: 
 *              name: backend
 *              path: ,handover,backend,
 *      responses:
 *        204:
 *          description: 그룹 삭제 성공
 *        401: 
 *          description: 인증 실패
 *        404:
 *          description: Not Found
 *        500:
 *          description: Interner Server Error
 */
router.delete('', groupController.delete);

module.exports = router;