import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { userInfo } from '~/api/user';

export const useUserStore = create(
  persist(
    (set) => ({
      userInfo: {
        id: null,
        nickName: null,
        email: null,
        username: null,
        avatar: null,
        createTime: null,
        updateTime: null,
      },
      updateUserInfo: async() => {
        const res = await userInfo();
        set({
          userInfo: {
            id: res.data.id || null,
            nickName: res.data.nickName || null,
            email: res.data.email || null,
            username: res.data.username || null,
            avatar: res.data.avatar || null,
            createTime: res.data.createTime || null,
            updateTime: res.data.updateTime || null,
          }
        });
      },
      restartUserInfo: () => {
        set({
          userInfo: {
            id: null,
            nickName: null,
            email: null,
            username: null,
            avatar: null,
            createTime: null,
            updateTime: null,
          }
        });
      }
    }),
    {
      name: 'user-info',
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          const serialized = JSON.stringify(value);
          sessionStorage.setItem(name, serialized);
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        }
      },
      partialize: (state) => ({ userInfo: state.userInfo }),
    }
  )
);
