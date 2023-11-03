import { Between, Repository } from 'typeorm'
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator'
import { Restaurant } from './entities/restaurant.entity'
@CustomRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  async findAll(query): Promise<Restaurant[]> {
    const { lat, lon, range } = query

    // 위도와 경도에 범위를 더하거나 뺀 값으로 사각형의 네 꼭짓점 구하기
    const latRange = range / 111 // 대략적으로 1도는 111km
    const lonRange = range / 88 // 대략적으로 1도는 88km

    const minLat = lat - latRange
    const maxLat = lat + latRange
    const minLon = lon - lonRange
    const maxLon = lon + lonRange

    // 데이터베이스에서 사각형 범위에 있는 식당을 찾음.
    const restaurants = await this.find({
      where: {
        lat: Between(minLat, maxLat),
        lon: Between(minLon, maxLon),
      },
    })
    return restaurants
  }
}
