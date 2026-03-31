
import React from 'react';

export const APP_NAME = "BioLink";

export const THEMES = [
  { id: 'classic', color: '#000000', label: 'Classic Black' },
  { id: 'ocean', color: '#0ea5e9', label: 'Ocean Blue' },
  { id: 'sunset', color: '#f43f5e', label: 'Sunset Red' },
  { id: 'emerald', color: '#10b981', label: 'Emerald Green' },
  { id: 'royal', color: '#6366f1', label: 'Royal Indigo' },
  { id: 'soft-pink', color: '#ec4899', label: 'Soft Pink' },
  { id: 'dark-gold', color: '#a16207', label: 'Dark Gold' },
];

export const FONTS = [
  { id: 'sans', family: 'Inter, sans-serif', label: 'Modern Sans' },
  { id: 'serif', family: 'Georgia, serif', label: 'Elegant Serif' },
  { id: 'mono', family: 'monospace', label: 'Clean Mono' },
];

export const BACKGROUND_LIBRARY = [
  { 
    category: 'Geométrico', 
    images: [
      { id: 'geo-1', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', label: 'Shapes Dark' },
      { id: 'geo-2', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80', label: 'Poly Dark' },
      { id: 'geo-3', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80', label: 'Wave White' },
      { id: 'geo-4', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80', label: 'Abstract Blue' },
      { id: 'geo-5', url: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=800&q=80', label: 'Gradient Mesh' }
    ]
  },
  { 
    category: 'Natureza', 
    images: [
      { id: 'leaf-1', url: 'https://images.unsplash.com/photo-1501004318641-72e54519849c?auto=format&fit=crop&w=800&q=80', label: 'Palm Leaves' },
      { id: 'leaf-2', url: 'https://images.unsplash.com/photo-1525498122383-3f5363ef1975?auto=format&fit=crop&w=800&q=80', label: 'Green Soft' },
      { id: 'leaf-3', url: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80', label: 'Bamboo' },
      { id: 'leaf-4', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80', label: 'Forest Mist' },
      { id: 'leaf-5', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80', label: 'Mountains' }
    ]
  },
  { 
    category: 'Conexão', 
    images: [
      { id: 'hand-1', url: 'https://images.unsplash.com/photo-1521791136064-7986c2959210?auto=format&fit=crop&w=800&q=80', label: 'Trust' },
      { id: 'hand-2', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', label: 'Teamwork' },
      { id: 'hand-3', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80', label: 'Office Link' },
      { id: 'hand-4', url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80', label: 'Friends' },
      { id: 'hand-5', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', label: 'Community' }
    ]
  },
  { 
    category: 'Minimalista', 
    images: [
      { id: 'min-1', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80', label: 'Clean Desk' },
      { id: 'min-2', url: 'https://images.unsplash.com/photo-1518655061766-48c238e819f7?auto=format&fit=crop&w=800&q=80', label: 'Soft Space' },
      { id: 'min-3', url: 'https://images.unsplash.com/photo-1484101403033-57105d2b77ca?auto=format&fit=crop&w=800&q=80', label: 'Modern Art' },
      { id: 'min-4', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80', label: 'White Flower' },
      { id: 'min-5', url: 'https://images.unsplash.com/photo-1454165833267-02d6980c39f3?auto=format&fit=crop&w=800&q=80', label: 'Workspace' }
    ]
  },
  { 
    category: 'Texturas', 
    images: [
      { id: 'txt-1', url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=800&q=80', label: 'Old Paper' },
      { id: 'txt-2', url: 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&w=800&q=80', label: 'Grey Wall' },
      { id: 'txt-3', url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=800&q=80', label: 'Silk Texture' },
      { id: 'txt-4', url: 'https://images.unsplash.com/photo-1528459801416-a7e99a0dce3a?auto=format&fit=crop&w=800&q=80', label: 'Canvas' },
      { id: 'txt-5', url: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=800&q=80', label: 'Black Marble' }
    ]
  },
  { 
    category: 'Abstrato', 
    images: [
      { id: 'abs-1', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80', label: 'Ink Flow' },
      { id: 'abs-2', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80', label: 'Colors' },
      { id: 'abs-3', url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80', label: '3D Render' },
      { id: 'abs-4', url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80', label: 'Liquid' },
      { id: 'abs-5', url: 'https://images.unsplash.com/photo-1506252374453-ef5237291d9d?auto=format&fit=crop&w=800&q=80', label: 'Smoke' }
    ]
  }
];

export const PRESET_TEMPLATES = [
  {
    id: 'midnight-oled',
    label: 'Midnight',
    themeColor: '#3b82f6',
    backgroundType: 'color',
    backgroundColor: '#000000',
    backgroundGradient: '',
    backgroundImageUrl: ''
  },
  {
    id: 'nature-fresh',
    label: 'Natureza',
    themeColor: '#059669',
    backgroundType: 'image',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1501004318641-72e54519849c?auto=format&fit=crop&w=800&q=80',
    backgroundColor: '#ffffff',
    backgroundGradient: ''
  },
  {
    id: 'cyberpunk-neon',
    label: 'Cyber',
    themeColor: '#d946ef',
    backgroundType: 'color',
    backgroundColor: '#0f172a',
    backgroundGradient: '',
    backgroundImageUrl: ''
  },
  {
    id: 'sunset-vibes',
    label: 'Sunset',
    themeColor: '#f43f5e',
    backgroundType: 'gradient',
    backgroundGradient: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    backgroundColor: '#ffffff'
  },
  {
    id: 'lavender-dreams',
    label: 'Lavanda',
    themeColor: '#8b5cf6',
    backgroundType: 'gradient',
    backgroundGradient: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    backgroundColor: '#ffffff'
  },
  {
    id: 'corporate-pro',
    label: 'Corporate',
    themeColor: '#1e40af',
    backgroundType: 'image',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    backgroundColor: '#ffffff'
  },
  {
    id: 'gold-luxury',
    label: 'Luxury',
    themeColor: '#a16207',
    backgroundType: 'image',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=800&q=80',
    backgroundColor: '#000000'
  },
  {
    id: 'soft-minimal',
    label: 'Minimal',
    themeColor: '#334155',
    backgroundType: 'color',
    backgroundColor: '#f8fafc',
    backgroundGradient: ''
  },
  {
    id: 'candy-pop',
    label: 'Candy',
    themeColor: '#f472b6',
    backgroundType: 'gradient',
    backgroundGradient: 'linear-gradient(-225deg, #FFC796 0%, #FF6B95 100%)',
    backgroundColor: '#ffffff'
  },
  {
    id: 'emerald-city',
    label: 'Emerald',
    themeColor: '#10b981',
    backgroundType: 'gradient',
    backgroundGradient: 'linear-gradient(to right, #0ba360 0%, #3cba92 100%)',
    backgroundColor: '#ffffff'
  },
  {
    id: 'dark-abstract',
    label: 'Abstrato',
    themeColor: '#6366f1',
    backgroundType: 'image',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    backgroundColor: '#000000'
  },
  {
    id: 'clean-white',
    label: 'Básico',
    themeColor: '#000000',
    backgroundType: 'color',
    backgroundColor: '#ffffff',
    backgroundGradient: ''
  }
];
