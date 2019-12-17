import { GET, Path, Security } from 'typescript-rest';
import { Tags } from 'typescript-rest-swagger';

enum PingStatus {
  OK = 'ok',
}

interface PingResponse {
  status: PingStatus;
}

@Tags('ping')
@Path('/ping')
@Security()
export class PingController {
  /**
   * Endpoint to check if the api works
   * @summary Ping
   */
  @GET
  public async ping(): Promise<PingResponse> {
    return {
      status: PingStatus.OK,
    };
  }
}
