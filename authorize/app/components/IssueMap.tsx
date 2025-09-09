'use client'

import { useEffect, useState, useRef } from 'react'

interface Issue {
  id: number
  title: string
  latitude: number
  longitude: number
  status: string
  category: string
}

interface IssueMapProps {
  issues: Issue[]
}

export default function IssueMap({ issues }: IssueMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => setMapLoaded(true)
      document.head.appendChild(script)

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
      const L = (window as any).L
      
      try {
        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 13)
              
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
              }).addTo(mapInstanceRef.current)

              // Add user location marker
              L.marker([latitude, longitude])
                .addTo(mapInstanceRef.current)
                .bindPopup('Your Location')
                .openPopup()

              // Add issue markers
              issues.forEach((issue) => {
                if (issue.latitude && issue.longitude) {
                  const color = issue.status === 'resolved' ? 'green' : 
                               issue.status === 'in_progress' ? 'blue' : 'red'
                  
                  const marker = L.circleMarker([issue.latitude, issue.longitude], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.7,
                    radius: 8
                  }).addTo(mapInstanceRef.current)
                  
                  marker.bindPopup(`
                    <div class="p-2">
                      <h3 class="font-bold">${issue.title}</h3>
                      <p class="text-sm text-gray-600">${issue.category}</p>
                      <p class="text-sm">Status: ${issue.status}</p>
                    </div>
                  `)
                }
              })
            },
            () => {
              // Fallback to India (Delhi) if geolocation fails
              mapInstanceRef.current = L.map(mapRef.current).setView([28.6139, 77.2090], 6)
              
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
              }).addTo(mapInstanceRef.current)

              issues.forEach((issue) => {
                if (issue.latitude && issue.longitude) {
                  const color = issue.status === 'resolved' ? 'green' : 
                               issue.status === 'in_progress' ? 'blue' : 'red'
                  
                  const marker = L.circleMarker([issue.latitude, issue.longitude], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.7,
                    radius: 8
                  }).addTo(mapInstanceRef.current)
                  
                  marker.bindPopup(`
                    <div class="p-2">
                      <h3 class="font-bold">${issue.title}</h3>
                      <p class="text-sm text-gray-600">${issue.category}</p>
                      <p class="text-sm">Status: ${issue.status}</p>
                    </div>
                  `)
                }
              })
            }
          )
        } else {
          // Fallback if geolocation is not supported - center on India (Delhi)
          mapInstanceRef.current = L.map(mapRef.current).setView([28.6139, 77.2090], 6)
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstanceRef.current)

          issues.forEach((issue) => {
            if (issue.latitude && issue.longitude) {
              const color = issue.status === 'resolved' ? 'green' : 
                           issue.status === 'in_progress' ? 'blue' : 'red'
              
              const marker = L.circleMarker([issue.latitude, issue.longitude], {
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                radius: 8
              }).addTo(mapInstanceRef.current)
              
              marker.bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold">${issue.title}</h3>
                  <p class="text-sm text-gray-600">${issue.category}</p>
                  <p class="text-sm">Status: ${issue.status}</p>
                </div>
              `)
            }
          })
        }
      } catch (error) {
        console.error('Map initialization error:', error)
      }
    }
  }, [mapLoaded, issues])

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      {!mapLoaded ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading map...</div>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full"></div>
      )}
    </div>
  )
}