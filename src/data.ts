export type Product = {
  id: number
  sku: string
  name: string
  stock: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  price: number
}

const names = [
  'Steel Bolt M8', 'Copper Wire 2mm', 'PVC Pipe 1in', 'LED Panel 40W',
  'Hex Nut M10', 'Cable Tie 200mm', 'Safety Gloves', 'Drill Bit Set',
  'Paint Roller', 'Wall Plug 6mm', 'Circuit Breaker 16A', 'Door Hinge',
  'Sandpaper 120g', 'Masking Tape', 'Wood Screw 40mm', 'Extension Cord 5m',
  'Switch Plate', 'Pipe Clamp', 'Silicone Sealant', 'Measuring Tape',
  'Angle Bracket', 'Washer M8', 'Padlock 40mm', 'Work Light',
  'Spirit Level', 'Utility Knife', 'Allen Key Set', 'Soldering Iron',
  'Duct Tape', 'Ceiling Rose',
]

export const products: Product[] = names.map((name, i) => {
  const stock = [0, 4, 12, 38, 95, 240, 410][(i * 3) % 7]
  return {
    id: i + 1,
    sku: `SKU-${1000 + i}`,
    name,
    stock,
    status: stock === 0 ? 'Out of Stock' : stock < 20 ? 'Low Stock' : 'In Stock',
    price: 50 + ((i * 37) % 900),
  }
})