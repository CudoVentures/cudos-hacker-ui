/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DemandMarketOrderComputeInstance {
  instance?: DemandMarketOrderInstance;
  lease?: DemandMarketOrderLease;
}

export interface DemandMarketOrderInstance {
  cpuClass?: string;
  cpuModel?: string;
  datacenterId?: string;

  /** @format int64 */
  gpuMem?: number;
  gpuModel?: string;

  /** @format int64 */
  gpuQuantity?: number;
  id?: string;
  lcmState?: string;
  localIpAddress?: string;

  /** @format int64 */
  memory?: number;
  oneState?: string;

  /** @format float */
  priceHr?: number;
  publicIpAddress?: string;
  regionId?: string;
  regionName?: string;

  /** @format int64 */
  storage?: number;

  /** @format int64 */
  vcpus?: number;
}

export interface DemandMarketOrderLease {
  id?: string;
  infrastructureType?: string;
  status?: string;
}

export interface ListOSImagesResponseImage {
  description?: string;
  displayName?: string;
  id?: string;
  name?: string;
  size?: string;
  tags?: string[];
}

export interface ListUserPermissionsResponseUserPermission {
  role?: string;
  userEmail?: string;
  userId?: string;
}

export interface Computev1Location {
  dataCenterId?: string;
  regionId?: string;
  regionName?: string;
}

export interface ProtobufAny {
  "@type"?: string;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  details?: ProtobufAny[];
  message?: string;
}

/**
* A representation of a decimal value, such as 2.5. Clients may convert values
into language-native decimal formats, such as Java's [BigDecimal][] or
Python's [decimal.Decimal][].

[BigDecimal]:
https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/math/BigDecimal.html
[decimal.Decimal]: https://docs.python.org/3/library/decimal.html
*/
export interface TypeDecimal {
  /**
   * The decimal value, as a string.
   *
   * The string representation consists of an optional sign, `+` (`U+002B`)
   * or `-` (`U+002D`), followed by a sequence of zero or more decimal digits
   * ("the integer"), optionally followed by a fraction, optionally followed
   * by an exponent.
   * The fraction consists of a decimal point followed by zero or more decimal
   * digits. The string must contain at least one digit in either the integer
   * or the fraction. The number formed by the sign, the integer and the
   * fraction is referred to as the significand.
   * The exponent consists of the character `e` (`U+0065`) or `E` (`U+0045`)
   * followed by one or more decimal digits.
   * Services **should** normalize decimal values before storing them by:
   *   - Removing an explicitly-provided `+` sign (`+2.5` -> `2.5`).
   *   - Replacing a zero-length integer value with `0` (`.5` -> `0.5`).
   *   - Coercing the exponent character to lower-case (`2.5E8` -> `2.5e8`).
   *   - Removing an explicitly-provided zero exponent (`2.5e0` -> `2.5`).
   * Services **may** perform additional normalization based on its own needs
   * and the internal decimal implementation selected, such as shifting the
   * decimal point and exponent value together (example: `2.5e-1` <-> `0.25`).
   * Additionally, services **may** preserve trailing zeroes in the fraction
   * to indicate increased precision, but are not required to do so.
   * Note that only the `.` character is supported to divide the integer
   * and the fraction; `,` **should not** be supported regardless of locale.
   * Additionally, thousand separators **should not** be supported. If a
   * service does support them, values **must** be normalized.
   * The ENBF grammar is:
   *     DecimalString =
   *       [Sign] Significand [Exponent];
   *     Sign = '+' | '-';
   *     Significand =
   *       Digits ['.'] [Digits] | [Digits] '.' Digits;
   *     Exponent = ('e' | 'E') [Sign] Digits;
   *     Digits = { '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' };
   * Services **should** clearly document the range of supported values, the
   * maximum supported precision (total number of digits), and, if applicable,
   * the scale (number of digits after the decimal point), as well as how it
   * behaves when receiving out-of-bounds values.
   * Services **may** choose to accept values passed as input even when the
   * value has a higher precision or scale than the service supports, and
   * **should** round the value to fit the supported scale. Alternatively, the
   * service **may** error with `400 Bad Request` (`INVALID_ARGUMENT` in gRPC)
   * if precision would be lost.
   * Services **should** error with `400 Bad Request` (`INVALID_ARGUMENT` in
   * gRPC) if the service receives a value outside of the supported range.
   */
  value?: string;
}

export interface V1ApiKey {
  /** @format date-time */
  createTime?: string;
  id?: string;
  key?: string;
}

export interface V1Auth {
  emailAddress?: string;
}

export interface V1BillingAccount {
  /** @format date-time */
  createTime?: string;
  demandEnabled?: boolean;
  displayName?: string;
  id?: string;
  supplyEnabled?: boolean;
}

export interface V1BuyComputeResponse {
  order?: V1DemandMarketOrder;
}

export interface V1Compute {
  /** @format int64 */
  availQuantity?: number;
  cpuClass?: string;
  cpuModel?: string;
  cpuVendor?: string;
  dataCenterId?: string;
  gpuClass?: string;

  /** @format int64 */
  gpuMem?: number;
  gpuModel?: string;

  /** @format int64 */
  gpuQuantity?: number;
  gpuVendor?: string;
  hgiId?: string;
  hsoId?: string;
  label?: string;
  lngLat?: V1DataCenterPoint;

  /** @format int64 */
  memory?: number;

  /** @format float */
  priceHr?: number;
  regionId?: string;
  renewableEnergy?: boolean;

  /** @format int64 */
  sockets?: number;

  /** @format int64 */
  storage?: number;
  supplierName?: string;

  /** @format int64 */
  vcpu?: number;
}

export interface V1ComputeInstance {
  instance?: V1Instance;
  lease?: V1Lease;
}

export interface V1CountHostsResponse {
  /** @format int32 */
  count?: number;
}

export interface V1CountInstancesResponse {
  /** @format int32 */
  count?: number;
}

export interface V1CreateBillingAccountRequest {
  displayName?: string;
}

export interface V1DataCenter {
  billingAccountId?: string;
  id?: string;
  lngLat?: V1Point;
  regionId?: string;
  renewableEnergy?: boolean;
  supplierName?: string;
}

export interface V1DataCenterPoint {
  /** @format double */
  lat?: number;

  /** @format double */
  lng?: number;
}

export interface V1DemandManageOrder {
  /** @format date-time */
  createTime?: string;
  description?: string;
  id?: string;
  infrastructureType?: string;

  /** @format float */
  priceHr?: number;

  /** @format int64 */
  quantity?: number;
  status?: string;
}

export interface V1DemandMarketOrder {
  /** @format date-time */
  createTime?: string;
  description?: string;
  id?: string;
  infrastructureType?: string;
  instances?: DemandMarketOrderComputeInstance[];

  /** @format float */
  priceHr?: number;
  projectId?: string;

  /** @format int64 */
  quantity?: number;
  status?: string;
}

export interface V1Earnings {
  /** @format date-time */
  dateTime?: string;

  /** @format int64 */
  earnings?: number;
}

export interface V1EnableHostGroupResponse {
  dataCenterId?: string;
  enabled?: boolean;
  hostGroupId?: string;
}

export interface V1GenerateApiKeyRequest {
  /**
   * The identifier to use for the api key, which will become the final component of
   * the api key's resource name.
   * This value should be 4-63 characters, and valid characters
   * are /[a-z][0-9]-/.
   */
  apikeyId: string;
}

export interface V1GetEarningsHostGroupInventoryResponse {
  earnings?: V1Earnings[];
}

export interface V1GetHostGroupInventoryResponse {
  inventory?: V1HostGroupInventory;
}

export interface V1GetInstanceResponse {
  compute?: V1ComputeInstance;
}

export interface V1GetProjectSpendHistoryResponse {
  projectSpendHistory?: V1ProjectSpend[];
}

export interface V1GetVncConnectUrlResponse {
  connectUrl?: string;
  token?: string;
}

export interface V1Host {
  enabled?: boolean;
  hostGroupInventoryId?: string;
  hostGroupInventoryLabel?: string;
  hostName?: string;
  id?: string;
  location?: Computev1Location;
  oneControllerId?: string;
  oneState?: string;

  /** @format float */
  utilisation?: number;
}

export interface V1HostGroupInventory {
  cpuClass?: string;
  cpuModel?: string;

  /** @format date-time */
  dateTime?: string;
  enabled?: boolean;
  enrolled?: boolean;

  /** @format int64 */
  gpuMem?: number;
  gpuModel?: string;

  /** @format int64 */
  gpuQuantity?: number;
  hosts?: V1HostShort[];
  id?: string;
  label?: string;
  location?: Computev1Location;

  /** @format int64 */
  memory?: number;

  /** @format float */
  priceHr?: number;
  slices?: V1SliceOption[];

  /** @format int64 */
  storage?: number;

  /** @format float */
  utilisation?: number;
}

export interface V1HostShort {
  enabled?: boolean;
  id?: string;
  ipAddress?: string;
  oneState?: string;
}

export interface V1HostSliceOption {
  /** @format date-time */
  createTime?: string;
  dedicated?: boolean;

  /** @format int32 */
  gpuQuantity?: number;
  hostGroupInventoryId?: string;
  id?: string;

  /** @format int32 */
  memory?: number;

  /** @format float */
  priceHr?: number;

  /** @format float */
  ratio?: number;

  /** @format int32 */
  sliceCount?: number;

  /** @format int32 */
  sliceSizeInUnits?: number;

  /** @format int32 */
  slicesFree?: number;

  /** @format int32 */
  slicesUsed?: number;

  /** @format int32 */
  storage?: number;

  /** @format int32 */
  vcpus?: number;
}

export interface V1Instance {
  cpuClass?: string;
  cpuModel?: string;
  datacenterId?: string;

  /** @format int64 */
  gpuMem?: number;
  gpuModel?: string;

  /** @format int64 */
  gpuQuantity?: number;
  id?: string;
  lcmState?: string;
  localIpAddress?: string;

  /** @format int64 */
  memory?: number;
  oneState?: string;

  /** @format float */
  priceHr?: number;
  publicIpAddress?: string;
  regionId?: string;
  regionName?: string;
  renewableEnergy?: boolean;

  /** @format int64 */
  storage?: number;

  /** @format int64 */
  vcpus?: number;
}

export interface V1InstanceMonitoringItem {
  /** @format float */
  cpu?: number;

  /** @format int32 */
  diskRdBytes?: number;

  /** @format int32 */
  diskRdIops?: number;

  /** @format int32 */
  diskWrBytes?: number;

  /** @format int32 */
  diskWrIops?: number;

  /** @format int32 */
  memory?: number;

  /** @format int32 */
  netRx?: number;

  /** @format int32 */
  netTx?: number;
  timestamp?: string;
}

export interface V1Lease {
  /** @format date-time */
  createTime?: string;

  /** @format date-time */
  endTime?: string;
  id?: string;
  infrastructureType?: string;
  status?: string;
}

export interface V1ListApiKeysResponse {
  apiKeys?: V1ApiKey[];

  /** @format int32 */
  pageNumber?: number;

  /** @format int32 */
  pageSize?: number;

  /** @format int32 */
  totalCount?: number;
}

export interface V1ListBillingAccountsResponse {
  billingAccounts?: V1BillingAccount[];

  /** @format int32 */
  pageSize?: number;
  pageToken?: string;
}

export interface V1ListDataCentersResponse {
  dataCenters?: V1DataCenter[];

  /** @format int32 */
  pageSize?: number;
  pageToken?: string;
}

export interface V1ListHostGroupInventoryResponse {
  inventory?: V1HostGroupInventory[];
}

export interface V1ListHostsResponse {
  hosts?: V1Host[];

  /** @format int32 */
  pageNumber?: number;

  /** @format int32 */
  pageSize?: number;

  /** @format int32 */
  totalCount?: number;
}

export interface V1ListInstancesResponse {
  instances?: V1ComputeInstance[];
}

export interface V1ListOSImagesResponse {
  images?: ListOSImagesResponseImage[];
}

export interface V1ListOrdersResponse {
  orders?: V1DemandManageOrder[];
}

export interface V1ListProjectSshKeysResponse {
  sshKeys?: V1SshKey[];
}

export interface V1ListProjectsResponse {
  /** @format int32 */
  pageSize?: number;
  pageToken?: string;
  projects?: V1Project[];
}

export interface V1ListRegionsResponse {
  regions?: V1Region[];
}

export interface V1ListSshKeysResponse {
  /** @format int32 */
  pageNumber?: number;

  /** @format int32 */
  pageSize?: number;
  sshKeys?: V1SshKey[];

  /** @format int32 */
  totalCount?: number;
}

export interface V1ListUserPermissionsResponse {
  billingAccountPermissions?: ListUserPermissionsResponseUserPermission[];
  dataCenterPermissions?: ListUserPermissionsResponseUserPermission[];
  projectPermissions?: ListUserPermissionsResponseUserPermission[];
}

export interface V1MonitorInstanceResponse {
  items?: V1InstanceMonitoringItem[];
}

export interface V1Point {
  /** @format double */
  lat?: number;

  /** @format double */
  lng?: number;
}

export interface V1Project {
  billingAccountId?: string;
  id?: string;
}

export interface V1ProjectSpend {
  /** @format date-time */
  endTime?: string;
  projectId?: string;

  /**
   * A representation of a decimal value, such as 2.5. Clients may convert values
   * into language-native decimal formats, such as Java's [BigDecimal][] or
   * Python's [decimal.Decimal][].
   *
   * [BigDecimal]:
   * https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/math/BigDecimal.html
   * [decimal.Decimal]: https://docs.python.org/3/library/decimal.html
   */
  spend?: TypeDecimal;

  /** @format date-time */
  startTime?: string;
  uid?: string;
}

export interface V1RebootInstanceResponse {
  compute?: V1ComputeInstance;
}

export interface V1Region {
  id?: string;
  name?: string;
}

export enum V1Role {
  UNKNOWN = "UNKNOWN",
  OWNER = "OWNER",
  VIEWER = "VIEWER",
  EDITOR = "EDITOR",
}

export interface V1SearchComputeRequest {
  /** @format int32 */
  availableGte?: number;
  cpuClass?: string[];
  cpuModel?: string[];
  cpuVendor?: string[];
  dataCenterId?: string[];
  gpuClass?: string[];

  /** @format int32 */
  gpuCountGte?: number;

  /** @format int32 */
  gpuCountLte?: number;
  gpuModel?: string[];
  gpuVendor?: string[];

  /** @format int32 */
  memoryGte?: number;

  /** @format int32 */
  memoryLte?: number;
  orderBy?: string;

  /** @format int32 */
  pageNumber?: number;

  /** @format int32 */
  pageSize?: number;

  /** @format float */
  priceHrLte?: number;
  regionId?: string[];
  renewableEnergy?: boolean;

  /** @format int32 */
  storageGte?: number;

  /** @format int32 */
  storageLte?: number;

  /** @format int32 */
  vcpusGte?: number;

  /** @format int32 */
  vcpusLte?: number;
}

export interface V1SearchComputeResponse {
  compute?: V1Compute[];
  request?: V1SearchComputeRequest;

  /** @format int32 */
  totalCount?: number;
}

export interface V1SearchDataCentersResponse {
  dataCenters?: V1DataCenter[];
}

export interface V1SetPriceHostGroupResponse {
  dataCenterId?: string;
  hostGroupId?: string;

  /** @format float */
  priceHr?: number;
  slices?: V1SliceOption[];
}

export interface V1SliceOption {
  id?: string;

  /** @format int64 */
  memory?: number;

  /** @format float */
  priceHr?: number;

  /** @format int64 */
  quantity?: number;

  /** @format int64 */
  vcpus?: number;
}

export interface V1SshKey {
  comment?: string;

  /** @format date-time */
  createTime?: string;
  fingerprint?: string;
  id?: string;
  publicKey?: string;
  type?: string;
}

export type V1StartInstanceResponse = object;

export type V1StopInstanceResponse = object;

export interface V1TerminateInstanceResponse {
  lease?: V1Lease;
}

export interface V1VerifyApiKeyRequest {
  key?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://rest.compute.cudo.org";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Cudo Compute service
 * @version 1.0.0
 * @baseUrl https://rest.compute.cudo.org
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @tags ApiKeyService
     * @name ListApiKeys
     * @request GET:/v1/api-keys
     */
    listApiKeys: (query?: { pageNumber?: number; pageSize?: number }, params: RequestParams = {}) =>
      this.request<V1ListApiKeysResponse, RpcStatus>({
        path: `/v1/api-keys`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ApiKeyService
     * @name GenerateApiKey
     * @request POST:/v1/api-keys
     */
    generateApiKey: (body: V1GenerateApiKeyRequest, params: RequestParams = {}) =>
      this.request<V1ApiKey, RpcStatus>({
        path: `/v1/api-keys`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ApiKeyService
     * @name VerifyApiKey
     * @request POST:/v1/api-keys/verify
     */
    verifyApiKey: (body: V1VerifyApiKeyRequest, params: RequestParams = {}) =>
      this.request<V1ApiKey, RpcStatus>({
        path: `/v1/api-keys/verify`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ApiKeyService
     * @name DeleteApiKey
     * @request DELETE:/v1/api-keys/{name}
     */
    deleteApiKey: (name: string, params: RequestParams = {}) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/api-keys/${name}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name Get
     * @request GET:/v1/auth
     */
    get: (params: RequestParams = {}) =>
      this.request<V1Auth, RpcStatus>({
        path: `/v1/auth`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name ListUserPermissions
     * @request GET:/v1/auth/permissions
     */
    listUserPermissions: (
      query?: { projectId?: string; dataCenterId?: string; billingAccountId?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1ListUserPermissionsResponse, RpcStatus>({
        path: `/v1/auth/permissions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags BillingAccountService
     * @name ListBillingAccounts
     * @request GET:/v1/billing-accounts
     */
    listBillingAccounts: (query?: { pageToken?: string; pageSize?: number }, params: RequestParams = {}) =>
      this.request<V1ListBillingAccountsResponse, RpcStatus>({
        path: `/v1/billing-accounts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags BillingAccountService
     * @name CreateBillingAccount
     * @request POST:/v1/billing-accounts
     */
    createBillingAccount: (body: V1CreateBillingAccountRequest, params: RequestParams = {}) =>
      this.request<V1BillingAccount, RpcStatus>({
        path: `/v1/billing-accounts`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags BillingAccountService
     * @name UpdateBillingAccount
     * @request PUT:/v1/billing-accounts/{billingAccount.id}
     */
    updateBillingAccount: (
      billingAccountId: string,
      billingAccount: { createTime?: string; demandEnabled?: boolean; displayName?: string; supplyEnabled?: boolean },
      query?: { updateMask?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1BillingAccount, RpcStatus>({
        path: `/v1/billing-accounts/{billingAccount.id}`,
        method: "PUT",
        query: query,
        body: billingAccount,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags BillingAccountService
     * @name UpdateBillingAccount2
     * @request PATCH:/v1/billing-accounts/{billingAccount.id}
     */
    updateBillingAccount2: (
      billingAccountId: string,
      billingAccount: { createTime?: string; demandEnabled?: boolean; displayName?: string; supplyEnabled?: boolean },
      query?: { updateMask?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1BillingAccount, RpcStatus>({
        path: `/v1/billing-accounts/{billingAccount.id}`,
        method: "PATCH",
        query: query,
        body: billingAccount,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name AddBillingAccountUserPermission
     * @request POST:/v1/billing-accounts/{billingAccountId}/add-user-permission
     */
    addBillingAccountUserPermission: (
      billingAccountId: string,
      body: { dataCenterId?: string; projectId?: string; role?: V1Role; userEmail?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/billing-accounts/${billingAccountId}/add-user-permission`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name ListOrders2
     * @request GET:/v1/billing-accounts/{billingAccountId}/orders
     */
    listOrders2: (billingAccountId: string, query?: { projectId?: string }, params: RequestParams = {}) =>
      this.request<V1ListOrdersResponse, RpcStatus>({
        path: `/v1/billing-accounts/${billingAccountId}/orders`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name RemoveBillingAccountUserPermission
     * @request POST:/v1/billing-accounts/{billingAccountId}/remove-user-permission
     */
    removeBillingAccountUserPermission: (
      billingAccountId: string,
      body: { dataCenterId?: string; projectId?: string; role?: V1Role; userId?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/billing-accounts/${billingAccountId}/remove-user-permission`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags BillingAccountService
     * @name GetBillingAccount
     * @request GET:/v1/billing-accounts/{id}
     */
    getBillingAccount: (id: string, params: RequestParams = {}) =>
      this.request<V1BillingAccount, RpcStatus>({
        path: `/v1/billing-accounts/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags BillingAccountService
     * @name DeleteBillingAccount
     * @request DELETE:/v1/billing-accounts/{id}
     */
    deleteBillingAccount: (id: string, params: RequestParams = {}) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/billing-accounts/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandMarketService
     * @name GetHostSliceOption
     * @request GET:/v1/compute/host-slice-options/{hostSliceOptionId}
     */
    getHostSliceOption: (hostSliceOptionId: string, params: RequestParams = {}) =>
      this.request<V1HostSliceOption, RpcStatus>({
        path: `/v1/compute/host-slice-options/${hostSliceOptionId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandMarketService
     * @name ListOsImages
     * @request GET:/v1/compute/images
     */
    listOsImages: (params: RequestParams = {}) =>
      this.request<V1ListOSImagesResponse, RpcStatus>({
        path: `/v1/compute/images`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandMarketService
     * @name SearchCompute
     * @request GET:/v1/compute/search
     */
    searchCompute: (
      query?: {
        cpuVendor?: string[];
        cpuClass?: string[];
        cpuModel?: string[];
        gpuCountGte?: number;
        gpuCountLte?: number;
        gpuVendor?: string[];
        gpuClass?: string[];
        gpuModel?: string[];
        memoryGte?: number;
        memoryLte?: number;
        orderBy?: string;
        pageNumber?: number;
        pageSize?: number;
        priceHrLte?: number;
        regionId?: string[];
        availableGte?: number;
        storageGte?: number;
        storageLte?: number;
        vcpusGte?: number;
        vcpusLte?: number;
        renewableEnergy?: boolean;
        dataCenterId?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<V1SearchComputeResponse, RpcStatus>({
        path: `/v1/compute/search`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataCenterService
     * @name ListDataCenters
     * @request GET:/v1/data-centers
     */
    listDataCenters: (query?: { pageToken?: string; pageSize?: number }, params: RequestParams = {}) =>
      this.request<V1ListDataCentersResponse, RpcStatus>({
        path: `/v1/data-centers`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataCenterService
     * @name CreateDataCenter
     * @request POST:/v1/data-centers
     */
    createDataCenter: (dataCenter: V1DataCenter, params: RequestParams = {}) =>
      this.request<V1DataCenter, RpcStatus>({
        path: `/v1/data-centers`,
        method: "POST",
        body: dataCenter,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataCenterService
     * @name UpdateDataCenter
     * @request PUT:/v1/data-centers/{dataCenter.id}
     */
    updateDataCenter: (
      dataCenterId: string,
      dataCenter: {
        billingAccountId?: string;
        lngLat?: V1Point;
        regionId?: string;
        renewableEnergy?: boolean;
        supplierName?: string;
      },
      query?: { updateMask?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1DataCenter, RpcStatus>({
        path: `/v1/data-centers/{dataCenter.id}`,
        method: "PUT",
        query: query,
        body: dataCenter,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataCenterService
     * @name UpdateDataCenter2
     * @request PATCH:/v1/data-centers/{dataCenter.id}
     */
    updateDataCenter2: (
      dataCenterId: string,
      dataCenter: {
        billingAccountId?: string;
        lngLat?: V1Point;
        regionId?: string;
        renewableEnergy?: boolean;
        supplierName?: string;
      },
      query?: { updateMask?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1DataCenter, RpcStatus>({
        path: `/v1/data-centers/{dataCenter.id}`,
        method: "PATCH",
        query: query,
        body: dataCenter,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name AddDataCenterUserPermission
     * @request POST:/v1/data-centers/{dataCenterId}/add-user-permission
     */
    addDataCenterUserPermission: (
      dataCenterId: string,
      body: { billingAccountId?: string; projectId?: string; role?: V1Role; userEmail?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/add-user-permission`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataCenterService
     * @name CountHosts
     * @request GET:/v1/data-centers/{dataCenterId}/host-count
     */
    countHosts: (dataCenterId: string, params: RequestParams = {}) =>
      this.request<V1CountHostsResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/host-count`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name ListHostGroupInventory
     * @request GET:/v1/data-centers/{dataCenterId}/host-groups
     */
    listHostGroupInventory: (dataCenterId: string, params: RequestParams = {}) =>
      this.request<V1ListHostGroupInventoryResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/host-groups`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name GetEarningsHostGroupInventory
     * @request GET:/v1/data-centers/{dataCenterId}/host-groups/{hostGroupId}/earnings
     */
    getEarningsHostGroupInventory: (dataCenterId: string, hostGroupId: string, params: RequestParams = {}) =>
      this.request<V1GetEarningsHostGroupInventoryResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/host-groups/${hostGroupId}/earnings`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name EnableHostGroup
     * @request PUT:/v1/data-centers/{dataCenterId}/host-groups/{hostGroupId}/enable
     */
    enableHostGroup: (
      dataCenterId: string,
      hostGroupId: string,
      body: { enabled?: boolean },
      params: RequestParams = {},
    ) =>
      this.request<V1EnableHostGroupResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/host-groups/${hostGroupId}/enable`,
        method: "PUT",
        body: body,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name SetPriceHostGroup
     * @request PUT:/v1/data-centers/{dataCenterId}/host-groups/{hostGroupId}/set-price
     */
    setPriceHostGroup: (
      dataCenterId: string,
      hostGroupId: string,
      body: { priceHr?: number },
      params: RequestParams = {},
    ) =>
      this.request<V1SetPriceHostGroupResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/host-groups/${hostGroupId}/set-price`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name GetHostGroupInventory
     * @request GET:/v1/data-centers/{dataCenterId}/host-groups/{id}
     */
    getHostGroupInventory: (dataCenterId: string, id: string, params: RequestParams = {}) =>
      this.request<V1GetHostGroupInventoryResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/host-groups/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name ListHosts
     * @request GET:/v1/data-centers/{dataCenterId}/hosts
     */
    listHosts: (dataCenterId: string, query?: { pageNumber?: number; pageSize?: number }, params: RequestParams = {}) =>
      this.request<V1ListHostsResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/hosts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name CreateHost
     * @request POST:/v1/data-centers/{dataCenterId}/hosts
     */
    createHost: (dataCenterId: string, body: { host?: V1Host; oneControllerId?: string }, params: RequestParams = {}) =>
      this.request<V1Host, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/hosts`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name EnableHost
     * @request PUT:/v1/data-centers/{dataCenterId}/hosts/{id}/enable
     */
    enableHost: (dataCenterId: string, id: string, body: { enabled?: boolean }, params: RequestParams = {}) =>
      this.request<V1Host, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/hosts/${id}/enable`,
        method: "PUT",
        body: body,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SupplierHostGroupInventoryService
     * @name EnableHost2
     * @request PATCH:/v1/data-centers/{dataCenterId}/hosts/{id}/enable
     */
    enableHost2: (dataCenterId: string, id: string, body: { enabled?: boolean }, params: RequestParams = {}) =>
      this.request<V1Host, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/hosts/${id}/enable`,
        method: "PATCH",
        body: body,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name RemoveDataCenterUserPermission
     * @request POST:/v1/data-centers/{dataCenterId}/remove-user-permission
     */
    removeDataCenterUserPermission: (
      dataCenterId: string,
      body: { billingAccountId?: string; projectId?: string; role?: V1Role; userId?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/data-centers/${dataCenterId}/remove-user-permission`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataCenterService
     * @name GetDataCenter
     * @request GET:/v1/data-centers/{id}
     */
    getDataCenter: (id: string, params: RequestParams = {}) =>
      this.request<V1DataCenter, RpcStatus>({
        path: `/v1/data-centers/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataCenterService
     * @name DeleteDataCenter
     * @request DELETE:/v1/data-centers/{id}
     */
    deleteDataCenter: (id: string, params: RequestParams = {}) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/data-centers/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SshKeyService
     * @name ListProjectSshKeys
     * @request GET:/v1/project/{projectId}/ssh-keys
     */
    listProjectSshKeys: (projectId: string, params: RequestParams = {}) =>
      this.request<V1ListProjectSshKeysResponse, RpcStatus>({
        path: `/v1/project/${projectId}/ssh-keys`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectService
     * @name ListProjects
     * @request GET:/v1/projects
     */
    listProjects: (query?: { pageToken?: string; pageSize?: number }, params: RequestParams = {}) =>
      this.request<V1ListProjectsResponse, RpcStatus>({
        path: `/v1/projects`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectService
     * @name CreateProject
     * @request POST:/v1/projects
     */
    createProject: (project: V1Project, params: RequestParams = {}) =>
      this.request<V1Project, RpcStatus>({
        path: `/v1/projects`,
        method: "POST",
        body: project,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectService
     * @name GetProject
     * @request GET:/v1/projects/{id}
     */
    getProject: (id: string, params: RequestParams = {}) =>
      this.request<V1Project, RpcStatus>({
        path: `/v1/projects/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectService
     * @name DeleteProject
     * @request DELETE:/v1/projects/{id}
     */
    deleteProject: (id: string, params: RequestParams = {}) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/projects/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectService
     * @name GetProjectSpendHistory
     * @request GET:/v1/projects/{id}/spend
     */
    getProjectSpendHistory: (id: string, params: RequestParams = {}) =>
      this.request<V1GetProjectSpendHistoryResponse, RpcStatus>({
        path: `/v1/projects/${id}/spend`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectService
     * @name GetProjectCurrentSpend
     * @request GET:/v1/projects/{id}/spend/current
     */
    getProjectCurrentSpend: (id: string, params: RequestParams = {}) =>
      this.request<V1ProjectSpend, RpcStatus>({
        path: `/v1/projects/${id}/spend/current`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectService
     * @name UpdateProject
     * @request PUT:/v1/projects/{project.id}
     */
    updateProject: (
      projectId: string,
      project: { billingAccountId?: string },
      query?: { updateMask?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1Project, RpcStatus>({
        path: `/v1/projects/{project.id}`,
        method: "PUT",
        query: query,
        body: project,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectService
     * @name UpdateProject2
     * @request PATCH:/v1/projects/{project.id}
     */
    updateProject2: (
      projectId: string,
      project: { billingAccountId?: string },
      query?: { updateMask?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1Project, RpcStatus>({
        path: `/v1/projects/{project.id}`,
        method: "PATCH",
        query: query,
        body: project,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name AddProjectUserPermission
     * @request POST:/v1/projects/{projectId}/add-user-permission
     */
    addProjectUserPermission: (
      projectId: string,
      body: { billingAccountId?: string; dataCenterId?: string; role?: V1Role; userEmail?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/add-user-permission`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandMarketService
     * @name BuyCompute
     * @request POST:/v1/projects/{projectId}/buy/{hostSliceOptionId}
     */
    buyCompute: (
      projectId: string,
      hostSliceOptionId: string,
      body: { osId?: string; quantity?: number; startScript?: string; vmId?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1BuyComputeResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/buy/${hostSliceOptionId}`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name CountInstances
     * @request GET:/v1/projects/{projectId}/instance-count
     */
    countInstances: (projectId: string, params: RequestParams = {}) =>
      this.request<V1CountInstancesResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instance-count`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name ListInstances
     * @request GET:/v1/projects/{projectId}/instances
     */
    listInstances: (projectId: string, query?: { status?: string }, params: RequestParams = {}) =>
      this.request<V1ListInstancesResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instances`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name GetInstance
     * @request GET:/v1/projects/{projectId}/instances/{instanceId}
     */
    getInstance: (projectId: string, instanceId: string, params: RequestParams = {}) =>
      this.request<V1GetInstanceResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instances/${instanceId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name MonitorInstance
     * @request GET:/v1/projects/{projectId}/instances/{instanceId}/monitor
     */
    monitorInstance: (projectId: string, instanceId: string, params: RequestParams = {}) =>
      this.request<V1MonitorInstanceResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instances/${instanceId}/monitor`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name RebootInstance
     * @request PUT:/v1/projects/{projectId}/instances/{instanceId}/reboot
     */
    rebootInstance: (projectId: string, instanceId: string, params: RequestParams = {}) =>
      this.request<V1RebootInstanceResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instances/${instanceId}/reboot`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name StartInstance
     * @request POST:/v1/projects/{projectId}/instances/{instanceId}/start
     */
    startInstance: (projectId: string, instanceId: string, params: RequestParams = {}) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instances/${instanceId}/start`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name StopInstance
     * @request POST:/v1/projects/{projectId}/instances/{instanceId}/stop
     */
    stopInstance: (projectId: string, instanceId: string, params: RequestParams = {}) =>
      this.request<V1StopInstanceResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instances/${instanceId}/stop`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name TerminateInstance
     * @request POST:/v1/projects/{projectId}/instances/{instanceId}/terminate
     */
    terminateInstance: (projectId: string, instanceId: string, params: RequestParams = {}) =>
      this.request<V1TerminateInstanceResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instances/${instanceId}/terminate`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name GetVncConnectUrl
     * @request GET:/v1/projects/{projectId}/instances/{instanceId}/vnc
     */
    getVncConnectUrl: (
      projectId: string,
      instanceId: string,
      query?: { connectionId?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1GetVncConnectUrlResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/instances/${instanceId}/vnc`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DemandManageService
     * @name ListOrders
     * @request GET:/v1/projects/{projectId}/orders
     */
    listOrders: (projectId: string, query?: { billingAccountId?: string }, params: RequestParams = {}) =>
      this.request<V1ListOrdersResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/orders`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name RemoveProjectUserPermission
     * @request POST:/v1/projects/{projectId}/remove-user-permission
     */
    removeProjectUserPermission: (
      projectId: string,
      body: { billingAccountId?: string; dataCenterId?: string; role?: V1Role; userId?: string },
      params: RequestParams = {},
    ) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/projects/${projectId}/remove-user-permission`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags RegionService
     * @name ListRegions
     * @request GET:/v1/regions
     */
    listRegions: (params: RequestParams = {}) =>
      this.request<V1ListRegionsResponse, RpcStatus>({
        path: `/v1/regions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DataCenterService
     * @name SearchDataCenters
     * @request GET:/v1/search-data-centers
     */
    searchDataCenters: (query?: { regionId?: string[]; renewableEnergy?: boolean }, params: RequestParams = {}) =>
      this.request<V1SearchDataCentersResponse, RpcStatus>({
        path: `/v1/search-data-centers`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SshKeyService
     * @name ListSshKeys
     * @request GET:/v1/ssh-keys
     */
    listSshKeys: (query?: { pageNumber?: number; pageSize?: number }, params: RequestParams = {}) =>
      this.request<V1ListSshKeysResponse, RpcStatus>({
        path: `/v1/ssh-keys`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SshKeyService
     * @name CreateSshKey
     * @request POST:/v1/ssh-keys
     */
    createSshKey: (sshKey: V1SshKey, params: RequestParams = {}) =>
      this.request<V1SshKey, RpcStatus>({
        path: `/v1/ssh-keys`,
        method: "POST",
        body: sshKey,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SshKeyService
     * @name GetSshKey
     * @request GET:/v1/ssh-keys/{id}
     */
    getSshKey: (id: string, params: RequestParams = {}) =>
      this.request<V1SshKey, RpcStatus>({
        path: `/v1/ssh-keys/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SshKeyService
     * @name DeleteSshKey
     * @request DELETE:/v1/ssh-keys/{id}
     */
    deleteSshKey: (id: string, params: RequestParams = {}) =>
      this.request<V1StartInstanceResponse, RpcStatus>({
        path: `/v1/ssh-keys/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
}
