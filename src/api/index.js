/*
 * @Author: Mr.Tian
 * @Date: 2021-12-15 11:22:00
 * @LastEditTime: 2022-01-04 11:10:11
 * @LastEditors: Mr.Tian
 * @Description: 
 */
import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const updateUser = (query) => {
    return request({
        url: '/api/user',
        method: 'put',
        data: query
    })
};

export const deleteUser = (query) => {
    return request({
        url: `/api/deleteUser/${query.id}`,
        method: 'delete'
    })
};


// 获取博客列表
export const getArticle = (query) => {
    return request({
        url: '/api/article',
        method: 'get',
        params: query
    })
}

// 创建博客
export const createArticle = query => {
    return request({
        url: '/api/article/createArticle',
        method: 'post',
        data: query
    })
}

// 更新博客
export const updateAtricle = (id, query) => {
    return request({
        url: `/api/article/${id}`,
        method: 'put',
        data: query
    })
}

// 更新博客
export const deleteAtricle = (id) => {
    return request({
        url: `/api/article/${id}`,
        method: 'delete',
    })
}


// 获取标签
export const getTags = () => {
    return request({
        url: '/api/label',
        method: 'get'
    })
}

// 新增标签
export const createTags = (query) => {
    return request({
        url: '/api/label/createTag',
        method: 'post',
        data: query
    })
}

// 删除标签
export const deleteTags = (id) => {
    return request({
        url: `/api/label/${id}`,
        method: 'delete',
    })
}