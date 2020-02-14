import * as Crawler from 'crawler'
import jsdom from 'jsdom'

export class KitchenCrawlerService {

    public async crawlUrlForRecipes(url: string): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {

            const options = {
                // jQuery: jsdom,
                maxConnections: 10,
                callback: (error, res, done) => {
                    if (error) {
                        reject(error)
                    }
                    else {
                        const $ = res.$

                        const instructions = $('[class*=instructions]')

                        
                        console.log(res.body)
                        resolve(true)
                    }
                    done()
                }
            }
            let crawler = new Crawler(options)

            crawler.queue(url)
        })
    }

}