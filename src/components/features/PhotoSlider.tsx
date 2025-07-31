'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { PersonalPhoto, AspectRatio } from '@/types';

export interface PhotoSliderProps {
  photos: PersonalPhoto[];
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  showProgress?: boolean;
  transition?: 'fade' | 'slide' | 'scale';
  aspectRatio?: AspectRatio;
  className?: string;
}

export const PhotoSlider: React.FC<PhotoSliderProps> = ({
  photos,
  autoplay = true,
  interval = 4000,
  showDots = true,
  showProgress = true,
  transition = 'fade',
  aspectRatio = '4/3',
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [progress, setProgress] = useState(0);

  // 次のスライドに移動
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  }, [photos.length]);

  // 前のスライドに移動
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  }, [photos.length]);

  // 特定のスライドに移動
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 自動再生の制御
  useEffect(() => {
    if (!isPlaying || photos.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, nextSlide, photos.length]);

  // プログレスバーの更新
  useEffect(() => {
    if (!showProgress || !isPlaying) return;

    setProgress(0);
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (interval / 100));
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, [currentIndex, interval, isPlaying, showProgress]);

  // ホバー時の一時停止
  const handleMouseEnter = () => {
    if (autoplay) setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoplay) setIsPlaying(true);
  };

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isPlaying]);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-secondary-100 rounded-2xl">
        <p className="text-secondary-500">写真がありません</p>
      </div>
    );
  }

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  };

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl group', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="写真スライダー"
    >
      {/* メイン画像エリア */}
      <div className={cn('relative', aspectRatioClasses[aspectRatio])}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-slow ease-in-out',
              transition === 'fade' && 'opacity-0',
              index === currentIndex && 'opacity-100'
            )}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={photo.optimization.blurDataURL}
            />
            {/* 画像の説明文 */}
            {photo.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-white text-sm font-medium">
                  {photo.description}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* ナビゲーション矢印 */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-base hover:bg-white/30"
              aria-label="前の写真"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-base hover:bg-white/30"
              aria-label="次の写真"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* プログレスバー */}
      {showProgress && isPlaying && photos.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-primary-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ドットインジケーター */}
      {showDots && photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-base',
                index === currentIndex
                  ? 'bg-primary-500 w-6'
                  : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`写真 ${index + 1} を表示`}
            />
          ))}
        </div>
      )}

      {/* 再生/一時停止ボタン */}
      {autoplay && photos.length > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-base hover:bg-white/30"
          aria-label={isPlaying ? '一時停止' : '再生'}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}; 