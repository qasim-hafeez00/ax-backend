"use client"

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { getProductGeographicData } from '@/lib/api'

type HeatmapData = {
  lat: number
  lng: number
  value: number
}

export function SellerHeatmap({ productId }: { productId: string }) {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const data = await getProductGeographicData(productId)
        setHeatmapData(data)
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error)
      }
    }

    fetchHeatmapData()
  }, [productId])

  return (
    <div className="h-[400px] w-full">
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {heatmapData.map((point, index) => (
          <CircleMarker
            key={index}
            center={[point.lat, point.lng]}
            radius={Math.sqrt(point.value) * 5}
            fillColor="#ff7800"
            color="#000"
            weight={1}
            opacity={0.8}
            fillOpacity={0.8}
          >
            <Tooltip>Sales: {point.value}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

